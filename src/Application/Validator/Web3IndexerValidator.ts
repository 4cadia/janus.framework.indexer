const Web3 = require('web3');
import { AbstractValidator } from "fluent-ts-validator/AbstractValidator";
import SpiderConfig from "../../Domain/Entity/SpiderConfig";
import { inject, injectable } from "tsyringe";
import IndexedFile from "../../Domain/Entity/IndexedFile";

@injectable()
export default class Web3IndexerValidator extends AbstractValidator<SpiderConfig> {
    private _web3;
    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig) {
        super();
        this._web3 = new Web3(_spiderConfig.RpcHost);
    }
    ValidateIndexRequestAsync(indexedFile: IndexedFile, ownerAddress: string, callback: any) {
        this.ValidateAddress(ownerAddress, addressValidation => {
            if (!addressValidation.isValid())
                return callback(addressValidation);
            this.WebSiteExists(indexedFile.IpfsHash, ownerAddress, exists => {
                this.validateIf(s => exists)
                    .isEqualTo(false)
                    .withFailureMessage("Ipfs hash already indexed");
                callback(this.validate(this._spiderConfig));
            });
        });
    }
    ValidateAddress(ownerAddress: string, callback: any) {
        this.validateIf(s => ownerAddress)
            .fulfills(address => this.IsAddress(address))
            .withFailureMessage("Invalid Ethereum Address");
        callback(this.validate(this._spiderConfig));
    }
    IsAddress(address: string): boolean {
        return this._web3.utils.isAddress(address);
    }
    WebSiteExists(ipfsHash: string, ownerAddress: string, callback: any) {
        let indexerSm = new this._web3.eth.Contract(this._spiderConfig.indexerSmAbi, this._spiderConfig.indexerSmAddress);
        indexerSm.methods.webSiteExists(ipfsHash)
            .call({ from: ownerAddress, gas: 3000000 })
            .then(exists => {
                callback(exists);
            });
    }
}