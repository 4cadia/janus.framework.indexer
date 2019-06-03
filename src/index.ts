import "reflect-metadata";
import Bootstrapper from './Infra/IoC/Bootstrapper';
import ISpiderService from './Application/Interface/ISpiderService';
import IndexRequest from './Domain/Entity/IndexRequest';
import SpiderConfig from './Domain/Entity/SpiderConfig';
import jsonConfig from "../spiderconfig.json";
import { ContentType } from "./Domain/Entity/ContentType";
import MetaMaskConnector from "node-metamask";
import fs from "fs";
import JSZip from "jszip";
import IndexRequestValidator from './Application/Validator/IndexRequestValidator';
import IndexedResult from './Domain/Entity/IndexedResult';
import { ValidationResult } from "fluent-ts-validator";
import IIpfsService from "./Application/Interface/IIpfsService";

export default class Spider {
    _spiderConfig: SpiderConfig;
    _spiderService;
    _ipfsService;
    constructor(spiderConfig: SpiderConfig) {
        this._spiderConfig = spiderConfig;
        Bootstrapper.RegisterServices(spiderConfig);
        this._spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
        this._ipfsService = Bootstrapper.Resolve<IIpfsService>("IIpfsService");
    }
    AddContent(indexRequest: IndexRequest,
        callback: any) {
        let validator = new IndexRequestValidator(this._spiderConfig, this._ipfsService);
        let result = new IndexedResult();
        validator.ValidateRequest(indexRequest, validation => {
            result.Success = validation.isValid();
            result.Errors = validation.getFailureMessages();
            if (!result.Success)
                return callback(result);

            this._spiderService.AddContent(indexRequest, indexResult => {
                result.IndexedFiles = indexResult;
                callback(result);
            });
        });
    }
}


// let connector = new MetaMaskConnector({
//     port: 3333,
// });

// console.log("Sign in transaction through metamask connector: http://localhost:3333");
// connector.start().then(() => {
//     let config = new SpiderConfig();
//     let provider = connector.getProvider();
//     config.RpcHost = jsonConfig.EthereumRpcHost;
//     config.RpcPort = jsonConfig.EthereumRpcPort;
//     config.ipfsHost = jsonConfig.IpfsRpcHost;
//     config.ipfsPort = jsonConfig.IpfsRpcPort;
//     config.indexerSmAbi = jsonConfig.indexerSmAbi;
//     config.indexerSmAddress = jsonConfig.indexerSmAddress;
//     config.Web3Provider = provider;

//     let indexRequest = new IndexRequest();
//     indexRequest.Content = "abc";
//     indexRequest.ContentType = ContentType.Hash;
//     indexRequest.Address = "0xB8C0DF194E38EeF45F36Bd8fBbe41893ccc16D20";
//     Bootstrapper.RegisterServices(config);
//     let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
//     let ipfsService = Bootstrapper.Resolve<IIpfsService>("IIpfsService");
//     let validator = new IndexRequestValidator(config, ipfsService);
//     let result = new IndexedResult();
//     validator.ValidateRequest(indexRequest, validation => {
//         let error = validation.getFailureMessages();
//         console.log(error);
//         spiderService.AddContent(indexRequest, indexResult => {
//             console.log(indexResult);
//         });
//     });


// });



