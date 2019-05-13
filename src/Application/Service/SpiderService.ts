const DOMParser = require('xmldom').DOMParser;
import { injectable, inject } from "tsyringe";
import IIpfsService from "../Interface/IIpfsService";
import IWeb3IndexerService from "../Interface/IWeb3IndexerService";
import ISpiderService from "../Interface/ISpiderService";
import HtmlData from "../../Domain/Entity/HtmlData";
import IndexedHtmlResult from "../../Domain/Entity/IndexedHtmlResult";
import ISpiderValidator from "../Interface/ISpiderValidator";

@injectable()
export default class SpiderService implements ISpiderService {
    constructor(@inject("IIpfsService") private _ipfsService: IIpfsService,
        @inject("IWeb3IndexerService") private _web3IndexerService: IWeb3IndexerService,
        @inject("ISpiderValidator") private _spiderValidator: ISpiderValidator) {
    }
    AddContent(filePath: string, ownerAddress: string) {
        this._ipfsService.AddIpfsFile(filePath, ipfsHash => {
            this.AddContentByHash(ipfsHash, ownerAddress, result => {
                console.log(result);
            });
        });
    }
    AddContentByHash(ipfsHash: string, ownerAddress: string, callback: any) {
        this._ipfsService.GetIpfsFile(ipfsHash, (error, file) => {
            let htmlDataResult = this.GetHtmlData(file.content.toString("utf8"), ipfsHash);
            if (!htmlDataResult.Success)
                return callback(htmlDataResult);

            this._web3IndexerService.IndexHtml(htmlDataResult.HtmlData, ownerAddress, indexResult => {
                return callback(indexResult);
            });
        });
    }
    private GetHtmlData(rawHtml: string, ipfsHash: string): IndexedHtmlResult {
        let htmlData = new HtmlData();
        let result = new IndexedHtmlResult();
        htmlData.HtmlContent = rawHtml;
        let htmlDoc = new DOMParser().parseFromString(htmlData.HtmlContent, "text/xml");
        htmlData.Title = GetTitleValue(htmlDoc);
        htmlData.Tags = GetMetaTag(htmlDoc, "keywords").split(" ");
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