const Web3 = require('web3');
import IndexedHtml from '../../Domain/Entity/IndexedHtml';
import { inject, injectable } from 'tsyringe';
import SpiderConfig from '../../Domain/Entity/SpiderConfig';
import IIndexerSmService from '../Interface/IIndexerSmService';
const indexerSmAddress = "0xf32287E571E4eF770AA7be1d6253E39A23805332";
const indexerSmAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_tags",
                "type": "string[]"
            }
        ],
        "name": "addWebSiteEvent",
        "type": "event",
        "signature": "0x323da4cc5c3ecf4becdc48a202344c3082af74d4a3c0764c3814e60060d1de75"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_storageHash",
                "type": "string"
            },
            {
                "name": "_tags",
                "type": "string[]"
            },
            {
                "name": "_title",
                "type": "string"
            },
            {
                "name": "_description",
                "type": "string"
            }
        ],
        "name": "addWebSite",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x6b2a4abc"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_tags",
                "type": "string[]"
            }
        ],
        "name": "getWebSite",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x17513855"
    }
];

// export function isValidAddress(address): boolean {
//     let web3 = new Web3("http://127.0.0.1:9545");
//     return web3.utils.isAddress(address);
// }

@injectable()
export default class IndexerSmService implements IIndexerSmService {
    _web3;
    _indexerSm;
    constructor(@inject("SpiderConfig")
    private _spiderConfig: SpiderConfig) {
        this._web3 = new Web3("http://127.0.0.1:9545");
        this._indexerSm = new this._web3.eth.Contract(indexerSmAbi, indexerSmAddress);
    }

    public IndexContent(indexedHtml: IndexedHtml) {
        this._indexerSm.methods.addWebSite(indexedHtml.IpfsHash,
            indexedHtml.Tags,
            indexedHtml.Title,
            indexedHtml.Description)
            .send({ from: this._spiderConfig.OwnerAddress, gas: 3000000 });
    }
}



