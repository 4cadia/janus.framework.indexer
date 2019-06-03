import IpfsFile from "../../Domain/Entity/IpfsFile";

export default interface IIpfsService {
    AddIpfsFile(filePath: string, callback: any);
    AddIpfsFileList(fileArray: Array<IpfsFile>, callback: any);
    AddIpfsFolder(folderPath: string, callback: any);
    GetIpfsFile(ipfsHash: string, callback: any);
    HashExists(ipfsHash: string, callback: any);
}