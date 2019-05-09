import ILogService from '../Interface/ILogService';
import IndexedHtmlResult from '../../Domain/Entity/IndexedHtmlResult';
import HtmlData from '../../Domain/Entity/HtmlData';

export default class LogService implements ILogService {
    LogStep(step: string, indexedHtmlResult: IndexedHtmlResult) {
        if (indexedHtmlResult.Success)
            console.log(`${step} executed successfuly!`);
        else
            console.log(`${step} Errors : ${indexedHtmlResult.Errors.join().split(',').join("\r\n")}`);
    }

    LogResult(htmlData: HtmlData) {
        console.log("Indexed Result:");
        console.log(`Ipfs Hash: ${htmlData.IpfsHash}`);
        console.log(`Tags: ${htmlData.Tags.join()}`);
        console.log(`Title: ${htmlData.Title}`);
        console.log(`Description: ${htmlData.Description}`);
    }

}