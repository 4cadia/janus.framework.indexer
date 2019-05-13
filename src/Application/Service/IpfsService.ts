const ipfsClient = require('ipfs-http-client');
import HtmlData from '../../Domain/Entity/HtmlData'
import IndexedHtmlResult from '../../Domain/Entity/IndexedHtmlResult';
import IIpfsService from '../Interface/IIpfsService';
import { injectable, inject } from 'tsyringe';
import IIpfsValidator from '../Interface/ISpiderValidator';
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

