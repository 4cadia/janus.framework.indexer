import { injectable, inject } from "tsyringe";
import IIpfsService from "../Interface/IIpfsService";
import IWeb3IndexerService from "../Interface/IWeb3IndexerService";
import ISpiderService from "../Interface/ISpiderService";

@injectable()
export default class SpiderService implements ISpiderService {
    constructor(@inject("IpfsService") private _ipfsService: IIpfsService,
        @inject("IWeb3IndexerService") private _web3IndexerService: IWeb3IndexerService) {
    }
    AddContent(ipfsHash: string) {
        this._ipfsService.GetIpfsHtml(ipfsHash, (result) => {
            if (result.Success)
                this._web3IndexerService.IndexHtml(result.HtmlData, indexResult => {
                    console.log(indexResult);
                });
        });
    }
}