export default interface ISpiderService {
    AddContent(contentPath: string, ownerAddress: string);
    AddContentByHash(ipfsHash: string, ownerAddress: string);
}