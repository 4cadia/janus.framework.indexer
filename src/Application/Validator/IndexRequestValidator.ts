const Web3 = require('web3');
const JSZip = require("jszip");
import { AbstractValidator } from "fluent-ts-validator";
import IndexRequest from "../../Domain/Entity/IndexRequest";
import fs from "fs";
import { ContentType } from '../../Domain/Entity/ContentType';
import { inject } from 'tsyringe';
import SpiderConfig from "../../Domain/Entity/SpiderConfig";
import IIpfsService from "../Interface/IIpfsService";

export default class IndexRequestValidator extends AbstractValidator<IndexRequest>  {

    constructor(@inject("SpiderConfig") _spiderConfig: SpiderConfig,
        @inject("IIpfsService") private _ipfsService: IIpfsService) {
        super();
        let web3 = new Web3(_spiderConfig.RpcHost);
        this.validateIf(i => i.Content)
            .isNotEmpty()
            .isNotNull()
            .withFailureMessage("Content can't be empty");

        this.validateIf(i => fs.existsSync(i.Content))
            .isEqualTo(true)
            .when(i => i.ContentType == ContentType.Folder || i.ContentType == ContentType.File)
            .withFailureMessage("Invalid Path");

        this.validateIf(i => i.ContentType)
            .fulfills(type => type == ContentType.Hash || type == ContentType.File || type == ContentType.Folder || type == ContentType.Zip)
            .withFailureMessage("Invalid content type");

        this.validateIf(i => i.Address)
            .fulfills(address => web3.utils.isAddress(address))
            .withFailureMessage("Invalid Ethereum Address");
    }
    public ValidateRequest(indexRequest: IndexRequest, callback: any): any {

        if (indexRequest.ContentType == ContentType.Hash) {
            this._ipfsService.HashExists(indexRequest.Content, exists => {
                this.validateIf(exists)
                    .isEqualTo(true)
                    .withFailureMessage("Invalid Ipfs hash");
                return callback(this.validate(indexRequest));
            });
        }
        else if (indexRequest.ContentType == ContentType.Zip) {
            this.ValidateZipFile(indexRequest.Content, validZip => {
                indexRequest.ValidZip = validZip;
                this.validateIf(i => i.ValidZip)
                    .isDefined()
                    .withFailureMessage("Invalid Zip file");
                return callback(this.validate(indexRequest));
            });
        }
        else
            return callback(this.validate(indexRequest));
    }
    public ValidateZipFile(content: string, callback: any) {
        let zip = new JSZip();
        zip.loadAsync(content).then(zipFiles => { callback(zipFiles.folder()); }, () => { callback(); })
    }
}