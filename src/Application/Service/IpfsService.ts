const ipfsClient = require('ipfs-http-client');
const DOMParser = require('xmldom').DOMParser;
import HtmlData from '../../Domain/Entity/HtmlData'
import IndexedHtmlResult from '../../Domain/Entity/IndexedHtmlResult';
import IIpfsService from '../Interface/IIpfsService';
import { injectable, inject } from 'tsyringe';
import IIpfsValidator from '../Interface/IIpfsValidator';
import fs from "fs";

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
@injectable()
export default class IpfsService implements IIpfsService {
    _ipfsClient;
    constructor(@inject("IIpfsValidator") private _ipfsValidator: IIpfsValidator) {
        this._ipfsClient = new ipfsClient('localhost', '5001');
    }
    public GetIpfsHtml(ipfsHash: string, callback: any) {
        return this.GetIpfsFile(ipfsHash, (error, files) => {
            let htmlData = new HtmlData();
            let result = new IndexedHtmlResult();
            if (files) {
                files.forEach((file) => {
                    htmlData.HtmlContent = file.content.toString('utf8');
                    let htmlDoc = new DOMParser().parseFromString(htmlData.HtmlContent, "text/xml");
                    htmlData.Title = GetTitleValue(htmlDoc);
                    htmlData.Tags = GetMetaTag(htmlDoc, "keywords").split(" ");
                    htmlData.Description = GetMetaTag(htmlDoc, "description");
                    htmlData.IpfsHash = ipfsHash;
                    result.HtmlData = htmlData;
                });
            }
            let validationResult = this._ipfsValidator.ValidateHtmlData(htmlData);
            result.Success = validationResult.isValid();
            result.Errors = validationResult.getFailureMessages();
            callback(result);
        });
    }
    public AddIpfsFile(filePath: string, callback: any) {
        let fileText = fs.readFileSync(filePath, "utf8");
        let file = [
            {
                path: filePath,
                content: new Buffer(fileText)
            }
        ]
        return this._ipfsClient.add(file, (err, response) => {
            return callback(response[0].hash);
        });
    }
    public GetIpfsFile(ipfsHash: string, callback: any) {
        return this._ipfsClient.get(ipfsHash, (error, files) => {
            callback(error, files);
        });
    }
}

