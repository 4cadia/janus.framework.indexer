const DOMParser = require('xmldom').DOMParser;
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
                this._ipfsService.AddIpfsFolder(indexRequest.Content, (filesResult) => {
                    filesResult.forEach(f => {
                        let file = new IndexedFile();
                        file.IpfsHash = f.hash;
                        file.Content = f.fileText;
                        files.push(file);
                    });
                    callback(files);
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