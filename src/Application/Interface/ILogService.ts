import IndexedHtmlResult from '../../Domain/Entity/IndexedHtmlResult';
import HtmlData from '../../Domain/Entity/HtmlData';
export default interface ILogService {
    LogStep(step: string, indexedHtmlResult: IndexedHtmlResult);
    LogResult(htmlData: HtmlData);
}