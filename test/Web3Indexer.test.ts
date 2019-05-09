import 'jest';
import "reflect-metadata";
import { container } from '../src/index';
import Web3IndexerValidator from '../src/Application/Validator/Web3IndexerValidator';
import Web3IndexerService from '../src/Application/Service/Web3IndexerService';
import SpiderConfig from '../src/Domain/Entity/SpiderConfig';
import IWeb3IndexerValidator from '../src/Application/Interface/IWeb3IndexerValidator';
import HtmlData from '../src/Domain/Entity/HtmlData';

test.skip('skip', () => { })
jest.mock('../src/Application/Validator/Web3IndexerValidator');
test("Web3Validator - Invalid address validation", () => {
    let isAddressMock = jest.fn(() => {
        return false;
    });
    let config: SpiderConfig = container.resolve("SpiderConfig");
    let web3Validator: IWeb3IndexerValidator = new Web3IndexerValidator(config);
    web3Validator.IsAddress = isAddressMock;
    let web3Service = new Web3IndexerService(config, web3Validator);
    web3Service.IndexHtml(null, null, indexResult => {
        expect(indexResult.Errors.join()).toBe("Invalid Ethereum Address");
    });
});

test("Web3Validator - WebSite Exists validation", () => {
    let isAddressMock = jest.fn(() => {
        return true;
    });
    let WebSiteExistsMock = jest.fn((ipfsHash: string, ownerAddress: string, callback: any) => {
        callback(true);
    });
    let config: SpiderConfig = container.resolve("SpiderConfig");
    let web3Validator: IWeb3IndexerValidator = new Web3IndexerValidator(config);
    let web3Service = new Web3IndexerService(config, web3Validator);
    let htmlData: HtmlData = new HtmlData();
    web3Validator.IsAddress = isAddressMock;
    web3Validator.WebSiteExists = WebSiteExistsMock;
    web3Service.IndexHtml(htmlData, null, indexResult => {
        expect(indexResult.Errors.join()).toBe("Ipfs hash already indexed");
    });
});
