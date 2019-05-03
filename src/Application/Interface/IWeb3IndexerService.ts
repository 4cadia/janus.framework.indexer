import HtmlData from "../../Domain/Entity/HtmlData";
import IndexedHtmlResult from "../../Domain/Entity/IndexedHtmlResult";
export default interface IWeb3IndexerService {
    IndexHtml(htmlData: HtmlData): IndexedHtmlResult
}