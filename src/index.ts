import "reflect-metadata";
import { container } from "tsyringe";
import Spider from './Spider';
import Web3IndexerService from './Application/Service/Web3IndexerService';
container.register("IWeb3IndexerService", {
    useClass: Web3IndexerService
});
let spider = container.resolve(Spider);
spider.Start("QmTqhHXkqSAr4eEtfop37TNmanFMDdUL4W2h3muJHYMNVD");


