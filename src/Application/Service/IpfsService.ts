const ipfsClient = require('ipfs-http-client');
import SpiderConfig from '../../Domain/Entity/SpiderConfig';
import IIpfsService from '../Interface/IIpfsService';
import { injectable, inject } from 'tsyringe';
import fs from "fs";
import path from "path";
import TextHelper from '../../Infra/Helper/TextHelper';
import IpfsFile from '../../Domain/Entity/IpfsFile';

@injectable()
export default class IpfsService implements IIpfsService {
    _ipfsClient;
    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig) {
        this._ipfsClient = new ipfsClient(_spiderConfig.ipfsHost, _spiderConfig.ipfsPort, { protocol: _spiderConfig.ipfsProtocol });
    }
    public AddIpfsFile(filePath: string, callback: any) {
        let fileText = fs.readFileSync(filePath, "utf8");
        let file = [
            {
                path: filePath,
                content: Buffer.from(fileText)
            }
        ];
        return this._ipfsClient.add(file, (err, response) => {
            return callback(response[0].hash, fileText);
        });
    }
    AddIpfsFileList(fileArray: Array<IpfsFile>, callback: any) {
        return this._ipfsClient.add(fileArray, { recursive: true }, (err, response) => {
            return callback(response);
        });
    }
    public AddIpfsFolder(folderPath: string, callback: any) {
        this._ipfsClient.addFromFs(folderPath, { recursive: true }, (err, result) => {
            result.forEach(file => {
                let filePath = path.join(path.dirname(folderPath), file.path);
                if (!fs.lstatSync(filePath).isDirectory())
                    file.fileText = fs.readFileSync(filePath, "utf8");
            });
            callback(result);
        })
    }
    public GetIpfsFile(ipfsHash: string, callback: any) {
        return this._ipfsClient.get(ipfsHash, (error, files) => {
            callback(error, files[0]);
        });
    }
    public HashExists(ipfsHash: string, callback: any) {
        return this._ipfsClient.get(ipfsHash, (error, files) => {
            let exists = files ? true : false;
            callback(exists);
        });
    }
}

