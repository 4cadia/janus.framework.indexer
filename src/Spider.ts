import { injectable, inject, DependencyContainer } from "tsyringe";
import IIpfsService from "./Application/Interface/IIpfsService";
import IIndexerSmService from "./Application/Interface/IIndexerSmService";

@injectable()
export default class Spider {

    constructor(@inject("IpfsService") private _ipfsService: IIpfsService,
        @inject("IIndexerSmService") private _indexerSmService: IIndexerSmService) {
    }
    public Start(ipfsHash: string) {
        this._ipfsService.GetIpfsHtml(ipfsHash, (result) => {
            this._indexerSmService.IndexContent(result.IndexedContent);
        });
    }
}