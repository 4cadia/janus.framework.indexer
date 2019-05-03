const Web3 = require('web3');
import { AbstractValidator } from "fluent-ts-validator/AbstractValidator";
import IWeb3IndexerValidator from "../Interface/IWeb3IndexerValidator";
import SpiderConfig from "../../Domain/Entity/SpiderConfig";

export default class Web3IndexerValidator extends AbstractValidator<SpiderConfig> implements IWeb3IndexerValidator {
    ValidateAddress(spiderConfig: SpiderConfig) {
        let web3 = new Web3("http://127.0.0.1:9545");
        this.validateIf(s => s.OwnerAddress)
            .fulfills(adress => web3.utils.isAddress(adress))
            .withFailureMessage("Invalid Ethereum Address");
    }
}