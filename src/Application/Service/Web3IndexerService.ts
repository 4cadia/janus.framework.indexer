const Web3 = require('web3');
import HtmlData from '../../Domain/Entity/HtmlData';
import { inject, injectable } from 'tsyringe';
import SpiderConfig from '../../Domain/Entity/SpiderConfig';
import IWeb3IndexerService from '../Interface/IWeb3IndexerService';
import IWeb3IndexerValidator from '../Interface/IWeb3IndexerValidator';
import IndexedHtmlResult from '../../Domain/Entity/IndexedHtmlResult';

@injectable()
export default class Web3IndexerService implements IWeb3IndexerService {
    private _web3;
    private _indexerSm;
    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig,
        @inject("IWeb3IndexerValidator") private _web3IndexerValidator: IWeb3IndexerValidator) {
        this._web3 = new Web3(`${_spiderConfig.RpcHost}:${_spiderConfig.RpcPort}`);
        this._indexerSm = new this._web3.eth.Contract(_spiderConfig.indexerSmAbi, _spiderConfig.indexerSmAddress);
    }
    public IndexHtml(htmlData: HtmlData, ownerAddress: string, callback: any) {
        this._web3IndexerValidator.ValidateIndexRequestAsync(htmlData, ownerAddress, validation => {
            let result = new IndexedHtmlResult();
            result.Success = validation.isValid();
            result.Errors = validation.getFailureMessages();
            result.HtmlData = htmlData;
            if (result.Success)
                this._indexerSm.methods.addWebSite(htmlData.IpfsHash,
                    htmlData.Tags,
                    htmlData.Title,
                    htmlData.Description)
                    .send({ from: ownerAddress, gas: 3000000 });
            callback(result);
        });

    }
}



