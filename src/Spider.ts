import { injectable, inject, DependencyContainer } from "tsyringe";
import IWeb3IndexerService from "./Application/Interface/IWeb3IndexerService";
import Web3IndexerService from "./Application/Service/Web3IndexerService";

@injectable()
export default class Spider {

    constructor(@inject("IWeb3IndexerService")
    private web3IndexerService: IWeb3IndexerService) {
    }

    public Start(ipfsHash: string) {
        return this.web3IndexerService.IndexIpfsHostedHtml(ipfsHash);
    }
}