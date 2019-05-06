#!/usr/bin/env node
const clear = require("clear");
const figlet = require("figlet");
const chalk = require("chalk");
import path from "path";

import "reflect-metadata";
import { container } from "tsyringe";
import IpfsService from './Application/Service/IpfsService';
import Web3IndexerService from "./Application/Service/Web3IndexerService";
import IpfsValidator from "./Application/Validator/IpfsValidator";
import Web3IndexerValidator from "./Application/Validator/Web3IndexerValidator";
import SpiderService from "./Application/Service/SpiderService";
import SpiderConfig from "./Domain/Entity/SpiderConfig";
import LogService from "./Application/Service/LogService";

container.register("ILogService", {
    useClass: LogService
});
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
clear();
const program = require("commander");
console.log(chalk.red(figlet.textSync('Janus-cli', { horizontalLayout: 'full' })));
program
    .version('1.0.0')
    .description("Janus CLI - Web3 Indexer")
    .option('-I, --ipfs <item>', 'Ipfs Hash of the item to be indexed')
    .option('-A, --address <item>', 'Your ETH adress')
    .action(args => {
        let spider = container.resolve(SpiderService);
        spider.AddContent(args.ipfs, args.address);
    }).parse(process.argv);
console.log(program.helpInformation());