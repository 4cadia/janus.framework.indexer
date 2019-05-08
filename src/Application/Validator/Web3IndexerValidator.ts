const Web3 = require('web3');
import { AbstractValidator } from "fluent-ts-validator/AbstractValidator";
import IWeb3IndexerValidator from "../Interface/IWeb3IndexerValidator";
import SpiderConfig from "../../Domain/Entity/SpiderConfig";
import HtmlData from '../../Domain/Entity/HtmlData';
import { inject, injectable } from "tsyringe";

@injectable()
export default class Web3IndexerValidator extends AbstractValidator<SpiderConfig> implements IWeb3IndexerValidator {
    private _web3;
    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig) {
        super();
        this._web3 = new Web3("http://127.0.0.1:9545");
    }
    ValidateIndexRequestAsync(htmlData: HtmlData, ownerAddress: string, callback: any) {
        this.ValidateAddress(ownerAddress, addressValidation => {
            if (!addressValidation.isValid())
                return callback(addressValidation);

            let indexerSm = new this._web3.eth.Contract(this._spiderConfig.indexerSmAbi, this._spiderConfig.indexerSmAddress);
            indexerSm.methods.webSiteExists(htmlData.IpfsHash)
                .call({ from: ownerAddress, gas: 3000000 })
                .then(exists => {
                    this.validateIf(s => exists)
                        .isEqualTo(false)
                        .withFailureMessage("Ipfs hash already indexed");
                    callback(this.validate(this._spiderConfig));
                });
        });
    }
    ValidateAddress(ownerAddress: string, callback: any) {
        this.validateIf(s => ownerAddress)
            .fulfills(address => this._web3.utils.isAddress(address))
            .withFailureMessage("Invalid Ethereum Address");
        callback(this.validate(this._spiderConfig));
    }
}