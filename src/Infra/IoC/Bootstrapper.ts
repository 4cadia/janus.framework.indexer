import "reflect-metadata";
import { container, InjectionToken } from "tsyringe";
import IpfsService from "../../Application/Service/IpfsService";
import Web3IndexerService from "../../Application/Service/Web3IndexerService";
import ISpiderValidator from "../../Application/Validator/SpiderValidator";
import Web3IndexerValidator from "../../Application/Validator/Web3IndexerValidator";
import SpiderService from "../../Application/Service/SpiderService";
import SpiderConfig from "../../Domain/Entity/SpiderConfig";

export default class Bootstrapper {
    static Resolve<T>(token: InjectionToken<T>): T {
        return container.resolve(token);
    }
    static RegisterServices(config: SpiderConfig) {
        container.registerInstance("SpiderConfig", config);
        container.register("IIpfsService", {
            useClass: IpfsService
        });
        container.register("IWeb3IndexerService", {
            useClass: Web3IndexerService
        });
        container.register("ISpiderValidator", {
            useClass: ISpiderValidator
        });
        container.register("IWeb3IndexerValidator", {
            useClass: Web3IndexerValidator
        });
        container.register("ISpiderService", {
            useClass: SpiderService
        });
        return container;
    }
}