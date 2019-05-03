const Web3 = require('web3');
import HtmlData from '../../Domain/Entity/HtmlData';
import { inject, injectable } from 'tsyringe';
import SpiderConfig from '../../Domain/Entity/SpiderConfig';
import IWeb3IndexerService from '../Interface/IWeb3IndexerService';
import IWeb3IndexerValidator from '../Interface/IWeb3IndexerValidator';
import Web3IndexerValidator from '../Validator/Web3IndexerValidator';
import IndexedHtmlResult from '../../Domain/Entity/IndexedHtmlResult';
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

@injectable()
export default class Web3IndexerService implements IWeb3IndexerService {
    private _web3;
    private _indexerSm;
    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig,
        @inject("IWeb3IndexerValidator") private _web3IndexerValidator: IWeb3IndexerValidator) {
        this._web3 = new Web3("http://127.0.0.1:9545");
        this._indexerSm = new this._web3.eth.Contract(indexerSmAbi, indexerSmAddress);
    }

    public IndexHtml(htmlData: HtmlData): IndexedHtmlResult {
        let validationResult = this._web3IndexerValidator.ValidateAddress(this._spiderConfig);
        let result = new IndexedHtmlResult();
        result.Success = validationResult.isValid();
        result.Errors = validationResult.getFailureMessages();
        result.HtmlData = htmlData;
        if (result.Success)
            this._indexerSm.methods.addWebSite(htmlData.IpfsHash,
                htmlData.Tags,
                htmlData.Title,
                htmlData.Description)
                .send({ from: this._spiderConfig.OwnerAddress, gas: 3000000 });
        return result;
    }
}



