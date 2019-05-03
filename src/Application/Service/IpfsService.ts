const ipfsClient = require('ipfs-http-client');
const DOMParser = require('xmldom').DOMParser;
import IndexedHtml from '../../Domain/Entity/IndexedHtml'
import IndexResult from '../../Domain/Entity/IndexResult';
import IIpfsService from '../Interface/IIpfsService';
import { injectable, inject } from 'tsyringe';
import IIpfsValidator from '../Interface/IIpfsValidator';


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
        let indexed = new IndexedHtml();
        let result = new IndexResult();
        return this._ipfsClient.get(ipfsHash, (error, files) => {
            files.forEach((file) => {
                indexed.HtmlContent = file.content.toString('utf8');
                let htmlDoc = new DOMParser().parseFromString(indexed.HtmlContent, "text/xml");
                indexed.Title = GetTitleValue(htmlDoc);
                indexed.Tags = GetMetaTag(htmlDoc, "keywords").split(" ");
                indexed.Description = GetMetaTag(htmlDoc, "description");
                indexed.IpfsHash = ipfsHash;
                result.IndexedContent = indexed;
            });
            var validationResult = this._ipfsValidator.ValidateHtmlFile(indexed);
            result.Success = validationResult.isValid();
            result.Errors = validationResult.getFailureMessages();
            callback(result);
        });
    }


}

