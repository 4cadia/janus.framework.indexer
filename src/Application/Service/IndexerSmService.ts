const Web3 = require('web3');
import IndexedHtml from '../../Domain/Entity/IndexedHtml';
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

export default class IndexerSmService {
    _ownerAddress: string;
    _web3;
    _indexerSm;

    constructor(ownerAddress: string) {
        this._ownerAddress = ownerAddress;
        this._web3 = new Web3("http://127.0.0.1:9545");
        this._indexerSm = new this._web3.eth.Contract(indexerSmAbi, indexerSmAddress);
    }

    public IndexContent(indexedHtml: IndexedHtml, ownerAddress: string) {
        this._indexerSm.methods.addWebSite(indexedHtml.IpfsHash,
            indexedHtml.Tags,
            indexedHtml.Title,
            indexedHtml.Description)
            .send({ from: ownerAddress, gas: 3000000 });
    }
}



