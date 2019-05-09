import "reflect-metadata";
import { injectable, inject, DependencyContainer } from "tsyringe";
import IWeb3IndexerService from "../../Application/Interface/IIpfsService";
import Web3IndexerService from "../../Application/Service/IpfsService";
import { container } from "tsyringe";

export default class Bootstrapper {
    static RegisterServices(ownerAddress: string): DependencyContainer {
        container.register("IWeb3IndexerService", {
            useClass: Web3IndexerService
        });
        return container;
    }
}