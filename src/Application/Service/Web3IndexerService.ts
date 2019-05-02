const ipfsClient = require('ipfs-http-client');
const DOMParser = require('xmldom').DOMParser;
import IndexedHtml from '../../Domain/Entity/IndexedHtml'
import IndexerSmService from './IndexerSmService';
import IndexResult from '../../Domain/Entity/IndexResult';
import IWeb3IndexerService from '../Interface/IWeb3IndexerService';

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
export default class Web3IndexerService implements IWeb3IndexerService {
    public _indexerSmService: IndexerSmService;
    _ipfsClient;
    _ownerAddress: string;

    constructor() {
        let addrress = "0x0f0b73171eb91c502e10c93306c2b84596363f30";
        this._indexerSmService = new IndexerSmService(addrress);
        this._ipfsClient = new ipfsClient('localhost', '5001');
        this._ownerAddress = addrress;
    }

    async IndexIpfsHostedHtml(ipfsHash: string) {
        let indexed = new IndexedHtml();
        let result = new IndexResult();
        await this._ipfsClient.get(ipfsHash, function (error, files) {

            result.Success = !error;
            if (!result.Success) {
                result.Message = error.message;
                return result;
            }


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
            });
            this._indexerSmService.IndexContent(indexed, this._ownerAddress);
            return indexed;
        });
    }
}

