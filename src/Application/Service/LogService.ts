import ILogService from '../Interface/ILogService';
import IndexedHtmlResult from '../../Domain/Entity/IndexedHtmlResult';

export default class LogService implements ILogService {
    LogStep(step: string, indexedHtmlResult: IndexedHtmlResult) {
        if (indexedHtmlResult.Success)
            console.log(`${step} executed successfuly!`);
        else
            console.log(`${step} Errors : ${indexedHtmlResult.Errors.join().split(',').join("\r\n")}`);
    }

}