import HtmlData from "../../Domain/Entity/HtmlData";
export default interface IWeb3IndexerService {
    IndexHtml(htmlData: HtmlData, ownerAddress: string);
}