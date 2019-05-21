const DOMParser = require('xmldom').DOMParser;
import { injectable, inject } from "tsyringe";
import IIpfsService from "../Interface/IIpfsService";
import IWeb3IndexerService from "../Interface/IWeb3IndexerService";
import HtmlData from "../../Domain/Entity/HtmlData";
import IndexedHtmlResult from "../../Domain/Entity/IndexedHtmlResult";
import ISpiderValidator from "../Interface/ISpiderValidator";
import IndexRequest from "../../Domain/Entity/IndexRequest";
import ISpiderService from "../Interface/ISpiderService";
import { ContentType } from "../../Domain/Entity/ContentType";
import TextHelper from '../../Infra/Helper/TextHelper';

@injectable()
export default class SpiderService implements ISpiderService {
    constructor(@inject("IIpfsService") private _ipfsService: IIpfsService,
        @inject("IWeb3IndexerService") private _web3IndexerService: IWeb3IndexerService,
        @inject("ISpiderValidator") private _spiderValidator: ISpiderValidator) {
    }
    AddContent(IndexRequest: IndexRequest, ownerAddress: string, callback: any) {
        this.GetContent(IndexRequest, ownerAddress, (ipfsHash, fileText) => {
            let htmlDataResult = this.GetHtmlData(fileText, ipfsHash);
            if (!htmlDataResult.Success)
                return callback(htmlDataResult);

            this._web3IndexerService.IndexHtml(htmlDataResult.HtmlData, ownerAddress, indexResult => {
                callback(indexResult);
            });
        });
    }
    GetContent(indexRequest: IndexRequest, ownerAddress: string, callback: any) {

        switch (indexRequest.ContentType) {
            case ContentType.File:
                this._ipfsService.AddIpfsFile(indexRequest.Content, (ipfsHash, fileText) => {
                    callback(ipfsHash, fileText);
                });
                break;
            case ContentType.Folder:
                this._ipfsService.AddIpfsFolder(indexRequest.Content, (files) => {
                    let htmlFiles = files.filter(file => {
                        return TextHelper.FileIsHtml(file.path);
                    });
                    htmlFiles.forEach(htmlFile => {
                        callback(htmlFile.hash, htmlFile.fileText);
                    });
                });
                break;
            case ContentType.Hash:
                this._ipfsService.GetIpfsFile(indexRequest.Content, (error, file) => {
                    callback(indexRequest.Content, file.content.toString("utf8"));
                });
                break;
        }
    }
    private GetHtmlData(rawHtml: string, ipfsHash: string): IndexedHtmlResult {
        let htmlData = new HtmlData();
        let result = new IndexedHtmlResult();
        htmlData.HtmlContent = rawHtml;
        let htmlDoc = new DOMParser().parseFromString(htmlData.HtmlContent, "text/xml");
        htmlData.Title = GetTitleValue(htmlDoc);
        let tagsArray = GetMetaTag(htmlDoc, "keywords");
        if (tagsArray)
            htmlData.Tags = tagsArray.split(" ");
        htmlData.Description = GetMetaTag(htmlDoc, "description");
        htmlData.IpfsHash = ipfsHash;
        result.HtmlData = htmlData;
        let validationResult = this._spiderValidator.ValidateHtmlData(htmlData);
        result.Success = validationResult.isValid();
        result.Errors = validationResult.getFailureMessages();
        return result;
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
    return title.textContent;
}