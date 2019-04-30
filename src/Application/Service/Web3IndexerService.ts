const ipfsClient = require('ipfs-http-client');
const DOMParser = require('xmldom').DOMParser;
import IndexedHtml from '../../Domain/Entity/IndexedHtml'
import IndexerSmService from './IndexerSmService';

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
export default class Web3IndexerService {
    // public _indexerSmService: IndexerSmService;

    constructor() {
        //inject   
    }

    async IndexIpfsHostedHtml(ipfsHash: string, ownerAddress: string) {
        let _indexerSmService = new IndexerSmService();

        const ipfs = new ipfsClient('localhost', '5001');
        let indexed = new IndexedHtml();
        await ipfs.get(ipfsHash, function (err, files) {
            files.forEach((file) => {
                let html = file.content.toString('utf8');
                let htmlDoc = new DOMParser().parseFromString(html, "text/xml");
                let title = GetTitleValue(htmlDoc);
                let tags = GetMetaTag(htmlDoc, "keywords");
                let description = GetMetaTag(htmlDoc, "description");
                indexed.IpfsHash = ipfsHash;
                indexed.Title = title;
                indexed.Tags = tags;
                indexed.Description = description;
            });
            _indexerSmService.IndexContent(indexed, ownerAddress);
            return indexed;
        });
    }
}

