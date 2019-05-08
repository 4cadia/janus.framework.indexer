import 'jest';
import "reflect-metadata";
import IpfsService from '../src/Application/Service/IpfsService';
import { container } from '../src/index';

test.skip('skip', () => {})
jest.mock('../src/Application/Service/IpfsService');
describe("Index Validation", () => {
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