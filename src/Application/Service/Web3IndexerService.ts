const Web3 = require('web3');
import HtmlData from '../../Domain/Entity/HtmlData';
import { inject, injectable } from 'tsyringe';
import SpiderConfig from '../../Domain/Entity/SpiderConfig';
import IWeb3IndexerService from '../Interface/IWeb3IndexerService';
import IWeb3IndexerValidator from '../Interface/IWeb3IndexerValidator';
import IndexedFile from '../../Domain/Entity/IndexedFile';
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
    public IndexHtml(indexedFile: IndexedFile, ownerAddress: string, callback: any) {
        this._web3IndexerValidator.ValidateIndexRequestAsync(indexedFile, ownerAddress, validation => {
            indexedFile.Success = validation.isValid();
            indexedFile.Errors = validation.getFailureMessages();

            if (indexedFile.Success) {
                this._indexerSm.methods.addWebSite(indexedFile.IpfsHash,
                    indexedFile.HtmlData.Tags,
                    indexedFile.HtmlData.Title,
                    indexedFile.HtmlData.Description)
                    .send({ from: ownerAddress, gas: 3000000 });
            }
            callback(indexedFile);
        });
    }
}



