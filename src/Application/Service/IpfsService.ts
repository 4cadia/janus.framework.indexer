const ipfsClient = require('ipfs-http-client');
import SpiderConfig from '../../Domain/Entity/SpiderConfig';
import IIpfsService from '../Interface/IIpfsService';
import { injectable, inject } from 'tsyringe';
import fs from "fs";
import path from "path";
import TextHelper from '../../Infra/Helper/TextHelper';

@injectable()
export default class IpfsService implements IIpfsService {
    _ipfsClient;
    constructor(@inject("SpiderConfig") private _spiderConfig: SpiderConfig) {
        this._ipfsClient = new ipfsClient(_spiderConfig.ipfsHost, _spiderConfig.ipfsPort, { protocol: 'https' });
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
    public AddIpfsFolder(folderPath: string, callback: any) {
        this._ipfsClient.addFromFs(folderPath, { recursive: true }, (err, result) => {
            result.filter(file => {
                return TextHelper.IsFile(file.path);
            }).forEach(file => {
                let filePath = path.join(path.dirname(folderPath), file.path);
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
}

