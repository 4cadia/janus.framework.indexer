import { injectable, inject, DependencyContainer } from "tsyringe";
import IWeb3IndexerService from "./Application/Interface/IWeb3IndexerService";
import Web3IndexerService from "./Application/Service/Web3IndexerService";
import IIndexerSmService from "./Application/Interface/IIndexerSmService";

@injectable()
export default class Spider {

    constructor(@inject("IWeb3IndexerService") private _web3IndexerService: IWeb3IndexerService,
        @inject("IIndexerSmService") private _indexerSmService: IIndexerSmService) {
    }

    public Start(ipfsHash: string) {
        this._web3IndexerService.IndexIpfsHostedHtml(ipfsHash, (result) => {
            this._indexerSmService.IndexContent(result.IndexedContent);
        });
    }
}