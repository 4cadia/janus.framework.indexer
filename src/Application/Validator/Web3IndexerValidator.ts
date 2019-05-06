const Web3 = require('web3');
import { AbstractValidator } from "fluent-ts-validator/AbstractValidator";
import IWeb3IndexerValidator from "../Interface/IWeb3IndexerValidator";
import SpiderConfig from "../../Domain/Entity/SpiderConfig";
import HtmlData from '../../Domain/Entity/HtmlData';
import { inject, injectable } from "tsyringe";

@injectable()
export default class Web3IndexerValidator extends AbstractValidator<SpiderConfig> implements IWeb3IndexerValidator {
    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig) {
        super();
    }
    ValidateIndexRequestAsync(htmlData: HtmlData, callback: any) {
        let web3 = new Web3("http://127.0.0.1:9545");
        let indexerSm = new web3.eth.Contract(this._spiderConfig.indexerSmAbi, this._spiderConfig.indexerSmAddress);
        indexerSm.methods.webSiteExists(htmlData.IpfsHash)
            .call({ from: this._spiderConfig.OwnerAddress, gas: 3000000 })
            .then(exists => {
                this.validateIf(s => s.OwnerAddress)
                    .fulfills(adress => web3.utils.isAddress(adress))
                    .withFailureMessage("Invalid Ethereum Address");

                this.validateIf(s => exists)
                    .isEqualTo(false)
                    .withFailureMessage("Ipfs hash already indexed");

                console.log(exists);
                callback(this.validate(this._spiderConfig));
            });
    }
}