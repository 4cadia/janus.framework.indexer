import { singleton, injectable } from "tsyringe";
@singleton()
export default class SpiderConfig {
    public RpcHost: string;
    public ipfsHost: string;
    public RpcPort: string;
    public ipfsPort: string;
    public indexerSmAddress: string;
    public indexerSmAbi;
    public PrivateKey: string;
    public Web3Provider: any;
}