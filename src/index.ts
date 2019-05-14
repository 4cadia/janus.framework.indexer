#!/usr/bin/env node
import Bootstrapper from './Infra/IoC/Bootstrapper';
import ISpiderService from './Application/Interface/ISpiderService';
import IndexRequest from './Domain/Entity/IndexRequest';
import SpiderConfig from './Domain/Entity/SpiderConfig';
import { ContentType } from './Domain/Entity/ContentType';

export default function AddContent(indexRequest: IndexRequest,
    ownerAddress: string,
    spiderConfig: SpiderConfig,
    callback: any) {
    Bootstrapper.RegisterServices(spiderConfig);
    let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
    spiderService.AddContent(indexRequest, ownerAddress, indexResult => {
        callback(indexResult);
    });
}