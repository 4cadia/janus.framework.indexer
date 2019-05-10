#!/usr/bin/env node
const clear = require("clear");
const figlet = require("figlet");
const chalk = require("chalk");
import Bootstrapper from './Infra/IoC/Bootstrapper';
import ISpiderService from "./Application/Interface/ISpiderService";
clear();
const program = require("commander");
console.log(chalk.red(figlet.textSync('Janus-cli', { horizontalLayout: 'full' })));
program
    .version('1.0.0')
    .description("Janus CLI - Web3 Indexer")
    .option('-I, --ipfs <item>', 'Ipfs Hash of the item to be indexed')
    .option('-A, --address <item>', 'Your ETH adress')
    .action(args => {
        Bootstrapper.RegisterServices();
        let spider = Bootstrapper.Resolve<ISpiderService>("ISpiderService");
        spider.AddContent("C:\\Users\\Victor Hugo Ramos\\Downloads\\Ipfs\\lua.html", args.address);
    }).parse(process.argv);
console.log(program.helpInformation());