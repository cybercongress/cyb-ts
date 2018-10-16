const bech32impl = require('bech32');

const hex = {
    hexToBytes(hex) {
        let bytes = [];
        for (let c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    },

    bytesToHex(bytes) {
        let hex = [];
        for (let i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("").toUpperCase();
    },

    stringToHex(str){
        let bytes = [];
        for(var i = 0; i < str.length; i++){
            bytes.push(str.charCodeAt(i).toString(16));
        }
        return bytes.join("");
    },

    isHex(str){
        str = str.replace("0x","");
        return /^[0-9a-fA-F]*$/i.test(str);
    }
};


const bech32 = {

    fromBech32(bech32Str) {
        let ownKey = bech32impl.decode(bech32Str);
        return hex.bytesToHex(bech32impl.fromWords(ownKey.words)).toUpperCase();
    },

    toBech32(prefix, str) {
        let strByte = bech32impl.toWords(Buffer.from(str, 'hex'));
        return bech32impl.encode(prefix, strByte)
    },

    isBech32(prefix, str) {
        if (!prefix || prefix.length == 0) {
            return false
        }

        let preReg = new RegExp('^' + prefix + '1');
        if (!preReg.test(str) ){
            return false
        }

        let allReg = new RegExp(/^[0-9a-zA-Z]*$/i);
        if (!allReg.test(str)){
            return false
        }

        try {
            bech32.fromBech32(str);
            return true
        }catch (e) {
            return false

        }
    }
};

module.exports = {
    hex: hex,
    bech32: bech32
};