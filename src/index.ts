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

export default class Spider {
    _ownerAddress: string;
    constructor(ownerAddress: string,
        spiderConfig: SpiderConfig) {
        this._ownerAddress = ownerAddress;
        Bootstrapper.RegisterServices(spiderConfig);
    }
    AddContent(indexRequest: IndexRequest,
        callback: any) {
        let validator = new IndexRequestValidator();
        let result = new IndexedResult();
        let validation = validator.validate(indexRequest);
        result.Success = validation.isValid();
        result.Errors = validation.getFailureMessages();
        if (!result.Success)
            return callback(result);

        let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
        spiderService.AddContent(indexRequest, this._ownerAddress, indexResult => {
            result.IndexedFiles = indexResult;
            callback(indexResult);
        });
    }
}


// let teste = fs.existsSync("C:\\Users\\Victor Hugo Ramos\\Downloads\\TesteVictor\\danilo.html");
// console.log(teste);

// let connector = new MetaMaskConnector({
//     port: 3333,
// });
// let provider = connector.getProvider();
// console.log("Sign in transaction through metamask connector: http://localhost:3333");
// connector.start().then(() => {
//     let config = new SpiderConfig();
//     config.RpcHost = jsonConfig.EthereumRpcHost;
//     config.RpcPort = jsonConfig.EthereumRpcPort;
//     config.ipfsHost = jsonConfig.IpfsRpcHost;
//     config.ipfsPort = jsonConfig.IpfsRpcPort;
//     config.indexerSmAbi = jsonConfig.indexerSmAbi;
//     config.indexerSmAddress = jsonConfig.indexerSmAddress;
//     config.Web3Provider = provider;

//     let indexRequest = new IndexRequest();
//     indexRequest.Content = "C:\\Users\\Victor Hugo Ramos\\Downloads\\TesteVictor\\Teste123.zip";
//     indexRequest.ContentType = ContentType.Zip;
//     Bootstrapper.RegisterServices(config);
//     let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
//     spiderService.AddContent(indexRequest, "0xB8C0DF194E38EeF45F36Bd8fBbe41893ccc16D20", indexResult => {
//         console.log(indexResult);
//     });
// });



