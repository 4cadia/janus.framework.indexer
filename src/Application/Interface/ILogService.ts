import IndexedHtmlResult from '../../Domain/Entity/IndexedHtmlResult';
export default interface ILogService {
    LogStep(step: string, indexedHtmlResult: IndexedHtmlResult);
}