const ipfsClient = require('ipfs-http-client');
import IIpfsService from '../Interface/IIpfsService';
import { injectable } from 'tsyringe';
import fs from "fs";

@injectable()
export default class IpfsService implements IIpfsService {
    _ipfsClient;
    constructor() {
        this._ipfsClient = new ipfsClient('localhost', '5001');
    }
    public AddIpfsFile(filePath: string, callback: any) {
        let fileText = fs.readFileSync(filePath, "utf8");
        let file = [
            {
                path: filePath,
                content: new Buffer(fileText)
            }
        ];
        return this._ipfsClient.add(file, (err, response) => {
            return callback(response[0].hash, fileText);
        });
    }
    public GetIpfsFile(ipfsHash: string, callback: any) {
        return this._ipfsClient.get(ipfsHash, (error, files) => {
            callback(error, files[0]);
        });
    }
}

