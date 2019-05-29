import "reflect-metadata";
import { container, InjectionToken } from "tsyringe";
import IpfsService from "../../Application/Service/IpfsService";
import Web3IndexerService from "../../Application/Service/Web3IndexerService";
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
        container.register("ISpiderService", {
            useClass: SpiderService
        });
        return container;
    }
}