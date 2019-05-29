const DOMParser = require('xmldom').DOMParser;
const Path = require('path');
import { injectable, inject } from "tsyringe";
import IIpfsService from "../Interface/IIpfsService";
import IWeb3IndexerService from "../Interface/IWeb3IndexerService";
import HtmlData from "../../Domain/Entity/HtmlData";
import IndexedFile from "../../Domain/Entity/IndexedFile";
import IndexRequest from "../../Domain/Entity/IndexRequest";
import ISpiderService from "../Interface/ISpiderService";
import { ContentType } from "../../Domain/Entity/ContentType";
import SpiderValidator from '../../Application/Validator/SpiderValidator';


@injectable()
export default class SpiderService implements ISpiderService {
    constructor(@inject("IIpfsService") private _ipfsService: IIpfsService,
        @inject("IWeb3IndexerService") private _web3IndexerService: IWeb3IndexerService) {
    }
    AddContent(IndexRequest: IndexRequest, ownerAddress: string, callback: any) {
        this.GetContent(IndexRequest, ownerAddress, (files) => {
            files.forEach(file => {
                file = this.FillIndexedFile(file);
                this._web3IndexerService.IndexFile(file, ownerAddress, (indexResult, indexCount) => {
                    file = indexResult;
                    if (indexCount == files.length)
                        return callback(files);
                });
            });
        });
    }
    private FillIndexedFile(file: IndexedFile): IndexedFile {
        //its a Path or no content
        if (!file.Content)
            return file;

        let htmlData = new HtmlData();
        let htmlDoc = new DOMParser({
            errorHandler: {
                warning: null,
                error: null, fatalError: null
            }
        }).parseFromString(file.Content, "text/html");
        let tagsArray = GetMetaTag(htmlDoc, "keywords");
        file.IsHtml = tagsArray ? true : false;
        if (file.IsHtml) {
            htmlData.Title = GetTitleValue(htmlDoc);
            htmlData.Description = GetMetaTag(htmlDoc, "description");
            htmlData.Tags = tagsArray.split(",");
            file.HtmlData = htmlData;
            let validator = new SpiderValidator();
            let validationResult = validator.ValidateHtmlData(htmlData);
            file.Success = validationResult.isValid();
            file.Errors = validationResult.getFailureMessages();
        }

        return file;
    }

    private ChangeToMainHash(mainHash: string, files: IndexedFile[]): IndexedFile[] {
        let result = new Array<IndexedFile>();

        files.forEach(file => {
            let changedFile = new IndexedFile();
            changedFile.IpfsHash = mainHash;
            changedFile.FileName = file.FileName;
            changedFile.Errors = file.Errors;
            changedFile.Success = file.Success;
            changedFile.IsHtml = file.IsHtml;
            changedFile.Content = file.Content;
            changedFile.HtmlData = file.HtmlData;
            result.push(changedFile);
        });

        return result;
    }

    private GetMainFolder(content: string): string {
        let splitedContent = content.split('\\');
        let mainFolder = splitedContent[splitedContent.length - 1];

        if (!mainFolder)
            mainFolder = splitedContent[splitedContent.length - 2];

        return mainFolder;
    }

    GetContent(indexRequest: IndexRequest, ownerAddress: string, callback: any) {
        let files = new Array<IndexedFile>();
        switch (indexRequest.ContentType) {
            case ContentType.File:
                this._ipfsService.AddIpfsFile(indexRequest.Content, (ipfsHash, fileText) => {
                    let file = new IndexedFile();
                    file.IpfsHash = ipfsHash;
                    file.Content = fileText;
                    files.push(file);
                    callback(files);
                });
                break;
            case ContentType.Folder:
                let mainFolder = this.GetMainFolder(indexRequest.Content);

                this._ipfsService.AddIpfsFolder(indexRequest.Content, (filesResult) => {

                    let mainHash: string;

                    filesResult.forEach(f => {

                        if (f.path === mainFolder)
                            mainHash = f.hash;

                        let file = new IndexedFile();
                        file.MainFolder = mainFolder;
                        file.IpfsHash = f.hash;
                        file.Content = f.fileText;
                        files.push(file);
                    });

                    let result = this.ChangeToMainHash(mainHash, files);

                    callback(result);
                });
                break;
            case ContentType.Hash:
                this._ipfsService.GetIpfsFile(indexRequest.Content, (error, fileResult) => {
                    let file = new IndexedFile();
                    file.IpfsHash = indexRequest.Content;
                    if (fileResult.content)
                        file.Content = fileResult.content.toString("utf8");
                    files.push(file);
                    callback(files);
                });
                break;
        }
    }
}
export function GetMetaTag(ipfsHtml, metaName): string {
    let metas = ipfsHtml.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === metaName) {
            return metas[i].getAttribute('content');
        }
    }
    return null;
}
export function GetTitleValue(ipfsHtml): string {
    let title = ipfsHtml.getElementsByTagName('title')[0];
    return title ? title.textContent : null;
}