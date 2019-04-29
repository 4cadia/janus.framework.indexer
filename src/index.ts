import Web3IndexerService from './Application/Service/Web3IndexerService'
export default class Spider {
    public IndexIpfsHostedHtml(ipfsHash: string) {
        var service = new Web3IndexerService();
        return service.IndexIpfsHostedHtml(ipfsHash);
    }
}

let spd = new Spider();
let index = spd.IndexIpfsHostedHtml("QmTqhHXkqSAr4eEtfop37TNmanFMDdUL4W2h3muJHYMNVD");
console.log(JSON.stringify(index));


