import 'jest';
import "reflect-metadata";
import IpfsService from '../src/Application/Service/IpfsService';
import { container } from '../src/index';
import template from "./templates/Template.json";

test.skip('skip', () => { })
jest.mock('../src/Application/Service/IpfsService');
describe("Index Validator Test", () => {
    let getIpfsMock = jest.fn((ipfsHash: string, callback: any) => {
        callback(null, null);
    });
    let ipfsService = new IpfsService(container.resolve("IIpfsValidator"));
    ipfsService.GetIpfsFile = getIpfsMock;
    ipfsService.GetIpfsHtml(null, indexResult => {
        it("Invalid File returns success equals false", () => {
            expect(indexResult.Success).toBeFalsy();
        });
        it("Invalid File returns File not found", () => {
            expect(indexResult.Errors).toContain("Ipfs file not found");
        });
        it("Invalid File returns Description is empty", () => {
            expect(indexResult.Errors).toContain("Description can't be empty");
        });
        it("Invalid File returns Tags is empty", () => {
            expect(indexResult.Errors).toContain("Tags can't be empty");
        });
        it("Invalid File returns Title is empty", () => {
            expect(indexResult.Errors).toContain("Title can't be empty");
        });
    });
});

describe("Content Test", () => {
    let htmlTemplate: any = template.html;
    let getIpfsMock = jest.fn((ipfsHash: string, callback: any) => {
        let file = [{
            content: htmlTemplate
        }];
        callback(null, file);
    });
    let ipfsService = new IpfsService(container.resolve("IIpfsValidator"));
    ipfsService.GetIpfsFile = getIpfsMock;
    ipfsService.GetIpfsHtml(null, indexedResult => {
        it("Tag extraction", () => {
            expect(indexedResult.HtmlData.Tags.join()).toBe(template.tags.join());
        });
        it("Title extraction", () => {
            expect(indexedResult.HtmlData.Title).toBe(template.title);
        });
        it("Description extraction", () => {
            expect(indexedResult.HtmlData.Description).toBe(template.description);
        });
        it("Success is true", () => {
            expect(indexedResult.Success).toBeTruthy();
        });
    });
});

