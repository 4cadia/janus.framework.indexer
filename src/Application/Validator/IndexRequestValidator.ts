const Web3 = require('web3');
import { AbstractValidator } from "fluent-ts-validator";
import IndexRequest from "../../Domain/Entity/IndexRequest";
import fs from "fs";
import { ContentType } from '../../Domain/Entity/ContentType';
import { inject } from 'tsyringe';
import SpiderConfig from "../../Domain/Entity/SpiderConfig";

export default class IndexRequestValidator extends AbstractValidator<IndexRequest>  {

    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig) {
        super();
        let web3 = new Web3(_spiderConfig.RpcHost)
        this.validateIf(i => i.Content)
            .isNotEmpty()
            .isNotNull()
            .withFailureMessage("Content can't be empty");

        this.validateIf(i => fs.existsSync(i.Content))
            .isEqualTo(true)
            .when(i => i.ContentType == ContentType.Folder || i.ContentType == ContentType.File)
            .withFailureMessage("Invalid Path");

        this.validateIf(i => i.ContentType)
            .fulfills(type => type == ContentType.File || type == ContentType.Folder || type == ContentType.Zip)
            .withFailureMessage("Invalid content type");

        this.validateIf(i => i.Address)
            .fulfills(address => web3.utils.isAddress(address))
            .withFailureMessage("Invalid Ethereum Address");
    }
}