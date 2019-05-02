import IndexResult from "../../Domain/Entity/IndexResult";

export default interface IIpfsService {
    GetIpfsHtml(ipfsHash: string, callback: any);
}