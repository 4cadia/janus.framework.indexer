#!/usr/bin/env node
import "reflect-metadata";
import Bootstrapper from './Infra/IoC/Bootstrapper';
import ISpiderService from './Application/Interface/ISpiderService';
import IndexRequest from './Domain/Entity/IndexRequest';
import SpiderConfig from './Domain/Entity/SpiderConfig';
import jsonConfig from "../spiderconfig.json";
import { ContentType } from "./Domain/Entity/ContentType";

export default class Spider {
    _ownerAddress: string;
    constructor(ownerAddress: string,
        spiderConfig: SpiderConfig) {
        this._ownerAddress = ownerAddress;
        Bootstrapper.RegisterServices(spiderConfig);
    }
    AddContent(indexRequest: IndexRequest,
        callback: any) {
        let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
        spiderService.AddContent(indexRequest, this._ownerAddress, indexResult => {
            callback(indexResult);
        });
    }
}

// let config = new SpiderConfig();
// config.RpcHost = jsonConfig.EthereumRpcHost;
// config.RpcPort = jsonConfig.EthereumRpcPort;
// config.ipfsHost = jsonConfig.IpfsRpcHost;
// config.ipfsPort = jsonConfig.IpfsRpcPort;
// config.indexerSmAbi = jsonConfig.indexerSmAbi;
// config.indexerSmAddress = jsonConfig.indexerSmAddress;

// let indexRequest = new IndexRequest();
// indexRequest.Content = "C:\\Users\\Victor Hugo Ramos\\Downloads\\TesteIndex";
// indexRequest.ContentType = ContentType.Folder;
// Bootstrapper.RegisterServices(config);
// let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
// spiderService.AddContent(indexRequest, "0xB8C0DF194E38EeF45F36Bd8fBbe41893ccc16D20", indexResult => {
//     console.log(indexResult);
// });



