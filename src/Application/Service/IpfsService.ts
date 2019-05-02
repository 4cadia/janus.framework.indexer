const ipfsClient = require('ipfs-http-client');
const DOMParser = require('xmldom').DOMParser;
import IndexedHtml from '../../Domain/Entity/IndexedHtml'
import IndexResult from '../../Domain/Entity/IndexResult';
import IIpfsService from '../Interface/IIpfsService';


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
export default class IpfsService implements IIpfsService {
    _ipfsClient;
    constructor() {
        this._ipfsClient = new ipfsClient('localhost', '5001');
    }

    public GetIpfsHtml(ipfsHash: string, callback: any) {
        let indexed = new IndexedHtml();
        let result = new IndexResult();
        return this._ipfsClient.get(ipfsHash, (error, files) => {
            // result.Success = !error;
            // if (!result.Success) {
            //     result.Message = error.message;
            //     return result;
            // }

            files.forEach((file) => {

                let html = file.content.toString('utf8');
                let htmlDoc = new DOMParser().parseFromString(html, "text/xml");
                let title = GetTitleValue(htmlDoc);
                let tags = GetMetaTag(htmlDoc, "keywords");
                let description = GetMetaTag(htmlDoc, "description");
                indexed.IpfsHash = ipfsHash;
                indexed.Title = title;
                indexed.Tags = tags.split(" ");
                indexed.Description = description;
                result.IndexedContent = indexed;
            });
            callback(result);
        });
    }


}

