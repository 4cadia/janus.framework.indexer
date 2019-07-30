import "reflect-metadata";
import { container, InjectionToken } from "tsyringe";
import IpfsService from "../../Application/Service/IpfsService";
import Web3IndexerService from "../../Application/Service/Web3IndexerService";
import SpiderService from "../../Application/Service/SpiderService";
import SpiderConfig from "../../Domain/Entity/SpiderConfig";
import jsonConfig from "../../../spiderconfig.json";

export default class Bootstrapper {
    static Resolve<T>(token: InjectionToken<T>): T {
        return container.resolve(token);
    }
    static RegisterServices(web3Provider: any) {
        let config = new SpiderConfig();
        config.RpcHost = jsonConfig.EthereumRpcHost;
        config.RpcPort = jsonConfig.EthereumRpcPort;
        config.ipfsHost = jsonConfig.IpfsRpcHost;
        config.ipfsPort = jsonConfig.IpfsRpcPort;
        config.indexerSmAbi = jsonConfig.indexerSmAbi;
        config.indexerSmAddress = jsonConfig.indexerSmAddress;
        config.ipfsProtocol = jsonConfig.IpfsProtocol;
        config.Web3Provider = web3Provider;

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