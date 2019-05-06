#!/usr/bin/env node
const clear = require("clear");
const figlet = require("figlet");
import chalk from "chalk";
import path from "path";

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
// var program = require("commander");
// clear();
// console.log(chalk.red(figlet.textSync('Janus-cli', { horizontalLayout: 'full' })));
// program
//     .version('1.0.0')
//     .description("Janus CLI - Web3 Indexer")
//     .option('-C, --content', 'Content to be indexed')
//     .option('-A, --address', 'IPFS Address')
//     .parse(process.argv);

//     if (program.args.length === 0) program.help();

let spider = container.resolve(SpiderService);
spider.AddContent("QmTqhHXkqSAr4eEtfop37TNmanFMDdUL4W2h3muJHYMNVD");
console.log("feito");

