export default interface IIpfsService {
    GetIpfsHtml(ipfsHash: string, callback: any);
    GetIpfsFile(ipfsHash: string, callback: any);
}