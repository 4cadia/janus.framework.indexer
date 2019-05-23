const Web3 = require('web3');
import { inject, injectable } from 'tsyringe';
import SpiderConfig from '../../Domain/Entity/SpiderConfig';
import IWeb3IndexerService from '../Interface/IWeb3IndexerService';
import IndexedFile from '../../Domain/Entity/IndexedFile';
import Web3IndexerValidator from '../../Application/Validator/Web3IndexerValidator';

@injectable()
export default class Web3IndexerService implements IWeb3IndexerService {
    private _web3Provider;
    private _indexerSm;
    private _indexerCount: number = 0;

    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig) {
        this._web3Provider = new Web3(_spiderConfig.Web3Provider);
        this._indexerSm = new this._web3Provider.eth.Contract(_spiderConfig.indexerSmAbi, _spiderConfig.indexerSmAddress);
    }
    public IndexFile(indexedFile: IndexedFile, ownerAddress: string, callback: any) {
        let validator = new Web3IndexerValidator(this._spiderConfig);
        validator.ValidateIndexRequestAsync(indexedFile, ownerAddress, async validation => {
            if (indexedFile.Success) {
                indexedFile.Success = validation.isValid();
                indexedFile.Errors = validation.getFailureMessages();
            }
            if (!indexedFile.IsHtml || !indexedFile.Success) {
                this._indexerCount++;
                callback(indexedFile, this._indexerCount);
            }
            else {
                await this._indexerSm.methods.addWebSite(indexedFile.IpfsHash,
                    indexedFile.HtmlData.Tags,
                    indexedFile.HtmlData.Title,
                    indexedFile.HtmlData.Description)
                    .call({ from: ownerAddress, gas: 3000000 })
                    .then(x => {
                        this._indexerCount++;
                        callback(indexedFile, this._indexerCount);
                    });
            }
        });
    }
}



