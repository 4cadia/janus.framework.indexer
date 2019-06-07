const DOMParser = require('xmldom').DOMParser;
const Path = require('path');
const isHtml = require('is-html');
import { injectable, inject } from "tsyringe";
import JSZip from "jszip";
import IIpfsService from "../Interface/IIpfsService";
import IWeb3IndexerService from "../Interface/IWeb3IndexerService";
import HtmlData from "../../Domain/Entity/HtmlData";
import IndexedFile from "../../Domain/Entity/IndexedFile"
import IndexRequest from "../../Domain/Entity/IndexRequest";
import ISpiderService from "../Interface/ISpiderService";
import { ContentType } from "../../Domain/Entity/ContentType";
import SpiderValidator from '../../Application/Validator/SpiderValidator';
import IpfsFile from "../../Domain/Entity/IpfsFile";


@injectable()
export default class SpiderService implements ISpiderService {
    constructor(@inject("IIpfsService") private _ipfsService: IIpfsService,
        @inject("IWeb3IndexerService") private _web3IndexerService: IWeb3IndexerService) {
    }
    AddContent(IndexRequest: IndexRequest, callback: any) {
        this.GetContent(IndexRequest, (files) => {
            files.forEach(file => {
                file = this.FillIndexedFile(file);
                this._web3IndexerService.IndexFile(file, IndexRequest.Address, (indexResult, indexCount) => {
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

        file.IsHtml = isHtml(file.Content);
        if (!file.IsHtml)
            return file;

        let htmlData = new HtmlData();
        let htmlDoc = new DOMParser({
            errorHandler: {
                warning: null,
                error: null,
                fatalError: null
            }
        }).parseFromString(file.Content, "text/html");
        let tags = GetMetaTag(htmlDoc, "keywords");
        htmlData.Title = GetTitleValue(htmlDoc);
        htmlData.Description = GetMetaTag(htmlDoc, "description");
        if (tags) {
            let tagsArray = tags.split(",");
            htmlData.Tags = new Array();
            tagsArray.forEach(t => {
                htmlData.Tags.push(t.trim());
            });
        }
        file.HtmlData = htmlData;
        let validator = new SpiderValidator();
        let validationResult = validator.ValidateHtmlData(htmlData);
        file.Success = validationResult.isValid();
        file.Errors = validationResult.getFailureMessages();
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
    GetContent(indexRequest: IndexRequest, callback: any) {
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
            case ContentType.Zip:
                let fileArray = new Array<IpfsFile>();
                var zip = new JSZip();
                zip.loadAsync(indexRequest.Content).then(
                    zipFiles => {
                        let fileCount = 0;
                        fileCount = zipFiles.folder().filter((fn, f) => !f.dir).length;
                        zipFiles.forEach((fileName, file) => {
                            if (!file.dir) {
                                file.async("text").then(fileContent => {
                                    let ipfsFile = new IpfsFile();
                                    ipfsFile.path = fileName;
                                    ipfsFile.content = Buffer.from(fileContent);
                                    fileArray.push(ipfsFile);
                                    if (fileArray.length == fileCount) {
                                        this._ipfsService.AddIpfsFileList(fileArray, (fileResponse) => {
                                            let ipfsFiles = Array.from(fileResponse);
                                            ipfsFiles.forEach(ipfsFile => {
                                                let fileArrayItem = fileArray.find(f => { return f.path == (<any>ipfsFile).path });
                                                if (fileArrayItem) {
                                                    let file = new IndexedFile();
                                                    file.IpfsHash = (<any>ipfsFile).hash;
                                                    file.Content = fileArrayItem.content.toString();
                                                    files.push(file);
                                                }
                                            });
                                            let rootFolderHash = (<any>ipfsFiles[ipfsFiles.length - 1]).hash;
                                            callback(this.ChangeToMainHash(rootFolderHash, files));
                                        });
                                    }
                                });
                            }
                        });
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