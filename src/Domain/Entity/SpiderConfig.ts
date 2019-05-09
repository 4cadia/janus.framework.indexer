import { singleton, injectable } from "tsyringe";
@singleton()
@injectable()
export default class SpiderConfig {
    public indexerSmAddress = "0xf32287E571E4eF770AA7be1d6253E39A23805332";
    public indexerSmAbi = [
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor",
            "signature": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_tags",
                    "type": "string[]"
                }
            ],
            "name": "addWebSiteEvent",
            "type": "event",
            "signature": "0x323da4cc5c3ecf4becdc48a202344c3082af74d4a3c0764c3814e60060d1de75"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "kill",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x41c0e1b5"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "storageHash",
                    "type": "string"
                }
            ],
            "name": "webSiteExists",
            "outputs": [
                {
                    "name": "exist",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x150ffdd3"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_storageHash",
                    "type": "string"
                },
                {
                    "name": "_tags",
                    "type": "string[]"
                },
                {
                    "name": "_title",
                    "type": "string"
                },
                {
                    "name": "_description",
                    "type": "string"
                }
            ],
            "name": "addWebSite",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x6b2a4abc"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_tags",
                    "type": "string[]"
                }
            ],
            "name": "getWebSite",
            "outputs": [
                {
                    "name": "",
                    "type": "string[15]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x17513855"
        }
    ];
}