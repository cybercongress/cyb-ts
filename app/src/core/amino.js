const codec = require("../util/codec");
const sha256 = require("sha256");
const constants = require('./constants');

class Amino {
    constructor() {
        this._keyMap = {};
    }

    registerConcrete(key) {
        this._keyMap[key] = this._aminoPrefix(key)
    }

    marshalBinary(key, message) {
        let prefixBytes = this._keyMap[key];
        prefixBytes = Buffer.from(prefixBytes.concat(message.length));
        prefixBytes = Buffer.concat([prefixBytes, message]);
        return prefixBytes
    }

    marshalBinaryWithoutPrefix(message) {
        let prefixBytes = Amino.getInt64Bytes(message.length);
        console.log("MESSAGE: ", message)
        console.log("PREFIX BYTES: ", prefixBytes, message.length)
        console.log("PREFIX BYTES 406: ", Amino.getInt64Bytes(406))
        prefixBytes = Buffer.concat([prefixBytes, message]);
        return prefixBytes
    }

    static getInt64Bytes(x) {
        let bytes = [];
        let i = 0;
        while (x >= 0x80) {
            bytes[i++] = (x & 0xff) | 0x80;
            x = x >> 7;
        }
        bytes[i] = x
        return Buffer.from(bytes);
    }


    marshalJSON(key, message) {
        return {
            "type": key,
            "value": message
        }
    }

    _aminoPrefix(name) {
        let a = sha256(name);
        let b = codec.hex.hexToBytes(a);
        while (b[0] === 0) {
            b = b.slice(1, b.length - 1)
        }
        b = b.slice(3, b.length - 1);
        while (b[0] === 0) {
            b = b.slice(1, b.length - 1)
        }
        b = b.slice(0, 4);// go-amino v0.6.2
        return b
    }
}

let amino = new Amino();
amino.registerConcrete(constants.AminoKey.SignatureSecp256k1_prefix);
amino.registerConcrete(constants.AminoKey.PubKeySecp256k1_prefix);
amino.registerConcrete("cyberd/Link");
amino.registerConcrete("auth/StdTx");

module.exports = amino;