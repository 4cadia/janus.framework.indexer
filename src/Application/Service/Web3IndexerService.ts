const Web3 = require('web3');
import HtmlData from '../../Domain/Entity/HtmlData';
import { inject, injectable } from 'tsyringe';
import SpiderConfig from '../../Domain/Entity/SpiderConfig';
import IWeb3IndexerService from '../Interface/IWeb3IndexerService';
import IWeb3IndexerValidator from '../Interface/IWeb3IndexerValidator';
import IndexedHtmlResult from '../../Domain/Entity/IndexedHtmlResult';
import Ethereumjs from "ethereumjs-tx";

@injectable()
export default class Web3IndexerService implements IWeb3IndexerService {
    private _web3Provider;
    private _indexerSm;
    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig,
        @inject("IWeb3IndexerValidator") private _web3IndexerValidator: IWeb3IndexerValidator) {
        this._web3Provider = new Web3(_spiderConfig.Web3Provider);
        this._indexerSm = new this._web3Provider.eth.Contract(_spiderConfig.indexerSmAbi, _spiderConfig.indexerSmAddress);
    }
    public IndexHtml(htmlData: HtmlData, ownerAddress: string, callback: any) {
        this._web3IndexerValidator.ValidateIndexRequestAsync(htmlData, ownerAddress, validation => {
            let result = new IndexedHtmlResult();
            result.Success = validation.isValid();
            result.Errors = validation.getFailureMessages();
            result.HtmlData = htmlData;
            if (result.Success) {
                // let count;
                // this._web3Provider.eth.getTransactionCount(ownerAddress).then(v => {
                //     count = v;
                //     var rawTransaction = {
                //         'from': ownerAddress,
                //         'gasPrice': this._web3Provider.utils.toHex(3000000),
                //         'gasLimit': this._web3Provider.utils.toHex(3000000),
                //         'to': this._spiderConfig.indexerSmAddress,
                //         'value': '0x0',
                //         'data': this._indexerSm.methods.addWebSite(htmlData.IpfsHash,
                //             htmlData.Tags,
                //             htmlData.Title,
                //             htmlData.Description).encodeABI(),
                //         'nonce': this._web3Provider.utils.toHex(count)
                //     };
                //     const privateKey = Buffer.from(this._spiderConfig.PrivateKey, 'hex');
                //     var transaction = new Ethereumjs(rawTransaction);
                //     transaction.sign(privateKey);
                //     this._web3Provider.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
                //         .on('transactionHash', console.log);
                // });
                this._indexerSm.methods.addWebSite(htmlData.IpfsHash,
                    htmlData.Tags,
                    htmlData.Title,
                    htmlData.Description)
                    .send({ from: ownerAddress, gas: 3000000 });
            }
            callback(result);
        });
    }
}



