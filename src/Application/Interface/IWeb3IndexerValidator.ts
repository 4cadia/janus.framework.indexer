import HtmlData from "../../Domain/Entity/HtmlData";

export default interface IWeb3IndexerValidator {
    ValidateIndexRequestAsync(htmlData: HtmlData, ownerAddress: string, callback: any);
    IsAddress(address: string): boolean;
    WebSiteExists(ipfsHash: string, ownerAddress: string, callback: any);
}