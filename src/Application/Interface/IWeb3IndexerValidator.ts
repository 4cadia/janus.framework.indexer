import IndexedFile from "../../Domain/Entity/IndexedFile";

export default interface IWeb3IndexerValidator {
    ValidateIndexRequestAsync(indexedFile: IndexedFile, ownerAddress: string, callback: any);
    IsAddress(address: string): boolean;
    WebSiteExists(ipfsHash: string, ownerAddress: string, callback: any);
}