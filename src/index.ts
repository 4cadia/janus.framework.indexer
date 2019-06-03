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

export default class Spider {
    _spiderConfig: SpiderConfig;
    constructor(spiderConfig: SpiderConfig) {
        this._spiderConfig = spiderConfig;
        Bootstrapper.RegisterServices(spiderConfig);
    }
    AddContent(indexRequest: IndexRequest,
        callback: any) {
        let validator = new IndexRequestValidator(this._spiderConfig);
        let result = new IndexedResult();
        let validation = validator.validate(indexRequest);
        result.Success = validation.isValid();
        result.Errors = validation.getFailureMessages();
        if (!result.Success)
            return callback(result);

        let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
        spiderService.AddContent(indexRequest, indexResult => {
            result.IndexedFiles = indexResult;
            callback(result);
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
//     indexRequest.Content = "C:\\Users\\Victor Hugo Ramos\\Downloads\\TesteVictor\\4files2\\4files";
//     indexRequest.ContentType = ContentType.Folder;
//     indexRequest.Address = "0xB8C0DF194E38EeF45F36Bd8fBbe41893ccc16D20";
//     let validator = new IndexRequestValidator(config);
//     let result = new IndexedResult();
//     let validation = validator.validate(indexRequest);
//     let error = validation.getFailureMessages();
//     console.log(error);
//     Bootstrapper.RegisterServices(config);
//     let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
//     spiderService.AddContent(indexRequest, indexResult => {
//         console.log(indexResult);
//     });
// });



