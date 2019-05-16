export default interface IIpfsService {
    AddIpfsFile(filePath: string, callback: any);
    AddIpfsFolder(folderPath: string, callback: any);
    GetIpfsFile(ipfsHash: string, callback: any);
}