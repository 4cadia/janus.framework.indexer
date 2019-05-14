#!/usr/bin/env node
import Bootstrapper from './Infra/IoC/Bootstrapper';
import ISpiderService from './Application/Interface/ISpiderService';
import IndexRequest from './Domain/Entity/IndexRequest';
import { ContentType } from './Domain/Entity/ContentType';

export default function AddContent(IndexRequest: IndexRequest, ownerAddress: string, callback: any) {
    Bootstrapper.RegisterServices();
    let spiderService = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
    spiderService.AddContent(IndexRequest, ownerAddress, indexResult => {
        callback(indexResult);
    });
}