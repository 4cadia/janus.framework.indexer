import "reflect-metadata";
import { container } from "tsyringe";
import IpfsService from './Application/Service/IpfsService';
import SpiderConfig from './Domain/Entity/SpiderConfig';
import Web3IndexerService from "./Application/Service/Web3IndexerService";
import IpfsValidator from "./Application/Validator/IpfsValidator";
import Web3IndexerValidator from "./Application/Validator/Web3IndexerValidator";
import SpiderService from "./Application/Service/SpiderService";

container.register("IpfsService", {
    useClass: IpfsService
});
container.register("IWeb3IndexerService", {
    useClass: Web3IndexerService
});
container.register("SpiderConfig", {
    useClass: SpiderConfig
});
container.register("IIpfsValidator", {
    useClass: IpfsValidator
});
container.register("IWeb3IndexerValidator", {
    useClass: Web3IndexerValidator
});
container.register("ISpiderService", {
    useClass: SpiderService
});

let spider = container.resolve(SpiderService);
spider.AddContent("abc123",);


