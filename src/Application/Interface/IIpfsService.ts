import IndexResult from "../../Domain/Entity/IndexedHtmlResult";

export default interface IIpfsService {
    GetIpfsHtml(ipfsHash: string, callback: any);
}