export default interface ISpiderService {
    AddContent(filePath: string, ownerAddress: string);
    AddContentByHash(ipfsHash: string, ownerAddress: string, callback: any);
}