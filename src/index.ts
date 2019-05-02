import "reflect-metadata";
import { container } from "tsyringe";
import Spider from './Spider';
import IpfsService from './Application/Service/IpfsService';
import SpiderConfig from './Domain/Entity/SpiderConfig';
import IndexerSmService from "./Application/Service/IndexerSmService";

container.register("IpfsService", {
    useClass: IpfsService
});
container.register("IIndexerSmService", {
    useClass: IndexerSmService
});
container.register("SpiderConfig", {
    useClass: SpiderConfig
});
let spider = container.resolve(Spider);
spider.Start("QmTqhHXkqSAr4eEtfop37TNmanFMDdUL4W2h3muJHYMNVD");


