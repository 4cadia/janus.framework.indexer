import IndexResult from "../../Domain/Entity/IndexResult";

export default interface IWeb3IndexerService {
    IndexIpfsHostedHtml(ipfsHash: string, callback: any);
}