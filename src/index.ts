#!/usr/bin/env node
import "reflect-metadata";
import Bootstrapper from './Infra/IoC/Bootstrapper';
import ISpiderService from './Application/Interface/ISpiderService';
import IndexRequest from './Domain/Entity/IndexRequest';
import SpiderConfig from './Domain/Entity/SpiderConfig';
import jsonConfig from "../spiderconfig.json";
import { ContentType } from "./Domain/Entity/ContentType";
import MetaMaskConnector from "node-metamask";

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

let connector = new MetaMaskConnector({
    port: 3333,
});
let provider = connector.getProvider();
console.log("Sign in transaction through metamask connector: http://localhost:3333");
connector.start().then(() => {
    let config = new SpiderConfig();
    config.RpcHost = jsonConfig.EthereumRpcHost;
    config.RpcPort = jsonConfig.EthereumRpcPort;
    config.ipfsHost = jsonConfig.IpfsRpcHost;
    config.ipfsPort = jsonConfig.IpfsRpcPort;
    config.indexerSmAbi = jsonConfig.indexerSmAbi;
    config.indexerSmAddress = jsonConfig.indexerSmAddress;
    config.Web3Provider = provider;

    let indexRequest = new IndexRequest();
    indexRequest.Content = "C:\\Users\\rodrigo.oliveira\\Desktop\\deploy_janus\\staticexample";
    indexRequest.ContentType = ContentType.Folder;
    Bootstrapper.RegisterServices(config);
    let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
    spiderService.AddContent(indexRequest, "0x17cA6A08758F4A078B9c53ca25E6F6736dF34094", indexResult => {
        console.log(indexResult);
    });
});



