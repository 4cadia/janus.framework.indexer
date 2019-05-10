import "reflect-metadata";
import { container, InjectionToken } from "tsyringe";
import IpfsService from "../../Application/Service/IpfsService";
import Web3IndexerService from "../../Application/Service/Web3IndexerService";
import IpfsValidator from "../../Application/Validator/IpfsValidator";
import Web3IndexerValidator from "../../Application/Validator/Web3IndexerValidator";
import SpiderService from "../../Application/Service/SpiderService";
import SpiderConfig from "../../Domain/Entity/SpiderConfig";
import LogService from "../../Application/Service/LogService";

export default class Bootstrapper {
    static Resolve<T>(token: InjectionToken<T>): T {
        return container.resolve(token);
    }
    static RegisterServices() {
        container.register("ILogService", {
            useClass: LogService
        });
        container.register("IIpfsService", {
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
        return container;
    }
}