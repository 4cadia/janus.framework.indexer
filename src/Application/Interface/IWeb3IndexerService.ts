import IndexedFile from "../..//Domain/Entity/IndexedFile";
export default interface IWeb3IndexerService {
    IndexFile(indexedFile: IndexedFile, ownerAddress: string, callback: any);
}