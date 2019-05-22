import IndexedFile from "../..//Domain/Entity/IndexedFile";
export default interface IWeb3IndexerService {
    IndexHtml(indexedFile: IndexedFile, ownerAddress: string, callback: any);
}