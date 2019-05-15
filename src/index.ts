#!/usr/bin/env node
import "reflect-metadata";
import Bootstrapper from './Infra/IoC/Bootstrapper';
import ISpiderService from './Application/Interface/ISpiderService';
import IndexRequest from './Domain/Entity/IndexRequest';
import SpiderConfig from './Domain/Entity/SpiderConfig';

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