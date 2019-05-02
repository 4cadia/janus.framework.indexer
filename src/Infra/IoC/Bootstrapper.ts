import "reflect-metadata";
import { injectable, inject, DependencyContainer } from "tsyringe";
import IWeb3IndexerService from "../../Application/Interface/IWeb3IndexerService";
import Web3IndexerService from "../../Application/Service/Web3IndexerService";
import { container } from "tsyringe";

export default class Bootstrapper {
    static RegisterServices(ownerAddress: string): DependencyContainer {
        container.register("IWeb3IndexerService", {
            useClass: Web3IndexerService
        });
        return container;
    }
}