import { injectable, inject } from "tsyringe";
import IIpfsService from "../Interface/IIpfsService";
import IWeb3IndexerService from "../Interface/IWeb3IndexerService";
import ISpiderService from "../Interface/ISpiderService";
import ILogService from '../../Application/Interface/ILogService';

@injectable()
export default class SpiderService implements ISpiderService {
    constructor(@inject("IIpfsService") private _ipfsService: IIpfsService,
        @inject("IWeb3IndexerService") private _web3IndexerService: IWeb3IndexerService,
        @inject("ILogService") private _logService: ILogService) {
    }
    AddContent(ipfsHash: string, ownerAddress: string) {
        this._ipfsService.GetIpfsHtml(ipfsHash, (result) => {
            this._logService.LogStep("Get IPFS file", result);
            if (result.Success)
                this._web3IndexerService.IndexHtml(result.HtmlData, ownerAddress, indexResult => {
                    this._logService.LogStep("Index Web3 file", indexResult);
                    if (indexResult.Success)
                        this._logService.LogResult(indexResult.HtmlData);
                });
        });
    }
}