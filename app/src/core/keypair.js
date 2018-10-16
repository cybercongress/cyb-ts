const codec = require("../util/codec");
const Sha256 = require("sha256");
const RIPEMD160 = require('ripemd160');
const bip39 = require('bip39');
const Random = require('randombytes');
const Secp256k1 = require('secp256k1');
const BN = require("bn.js");
const constants = require('./constants');
const amino = require('./amino');

module.exports = {

    getPrivateKeyFromSecret(mnemonicS) {
        let seed = bip39.mnemonicToSeed(mnemonicS);
        let master = hd.computeMastersFromSeed(seed);
        return hd.derivePrivateKeyForPath(master.secret, master.chainCode, constants.AminoKey.FullFundraiserPath);
    },

    sign(private_key, msg) {

        let sigByte = Buffer.from(JSON.stringify(msg));
        let sig32 = Buffer.from(Sha256(sigByte, {asBytes: true}));

        let prikeyArr = Buffer.from(new Uint8Array(codec.hex.hexToBytes(private_key)));
        let sig = Secp256k1.sign(sig32, prikeyArr);
        let signature = Buffer.from(hd.serialize(sig.signature));

        // signature = amino.marshalBinary(constants.AminoKey.SignatureSecp256k1_prefix, signature);
        return Array.from(signature)
    },

    getAddress(publicKey) {
        if (publicKey.length > 33) {
            publicKey = publicKey.slice(5, publicKey.length)
        }
        let hmac = Sha256(publicKey);
        let b = Buffer.from(codec.hex.hexToBytes(hmac));
        let addr = new RIPEMD160().update(b);
        return addr.digest('hex').toUpperCase();
    },

    create() {
        let entropySize = 24 * 11 - 8;
        let entropy = Random(entropySize / 8);
        let mnemonicS = bip39.entropyToMnemonic(entropy);

        let secretKey = this.getPrivateKeyFromSecret(mnemonicS);

        let pubKey = Secp256k1.publicKeyCreate(secretKey);
        pubKey = amino.marshalBinary(constants.AminoKey.PubKeySecp256k1_prefix, pubKey);

        return {
            "secret": mnemonicS,
            "address": this.getAddress(pubKey),
            "privateKey": codec.hex.bytesToHex(secretKey),
            "publicKey": codec.hex.bytesToHex(pubKey)
        };
    },

    recover(seed) {
        let secretKey = this.getPrivateKeyFromSecret(seed);
        let pubKey = Secp256k1.publicKeyCreate(secretKey);
        // pubKey = amino.marshalBinary(constants.AminoKey.PubKeySecp256k1_prefix, pubKey);

        return {
            "secret": seed,
            "address": this.getAddress(pubKey),
            "privateKey": codec.hex.bytesToHex(secretKey),
            "publicKey": codec.hex.bytesToHex(pubKey)
        };
    },

    import(secretKey) {
        let secretBytes = Buffer.from(secretKey, "hex");
        let pubKey = Secp256k1.publicKeyCreate(secretBytes);
        // pubKey = amino.marshalBinary(constants.AminoKey.PubKeySecp256k1_prefix, pubKey);

        return {
            "address": this.getAddress(pubKey),
            "privateKey": secretKey,
            "publicKey": codec.hex.bytesToHex(pubKey)
        };
    },

    isValidAddress(address) {
        let prefix = constants.CyberdNetConfig.PREFIX_BECH32_ACCADDR;
        return codec.bech32.isBech32(prefix, address);
    },

    isValidPrivate(privateKey) {
        return /^[0-9a-fA-F]{64}$/i.test(privateKey);
    },
}

const hd = {

    computeMastersFromSeed(seed) {
        let masterSecret = Buffer.from("Bitcoin seed");
        let master = hd.i64(masterSecret, seed);
        return master
    },

    derivePrivateKeyForPath(privKeyBytes, chainCode, path) {
        let data = privKeyBytes;
        let parts = path.split("/");
        parts.forEach(function (part) {
            let harden = part.slice(part.length - 1, part.length) === "'";
            if (harden) {
                part = part.slice(0, part.length - 1);
            }
            let idx = parseInt(part)
            let json = hd.derivePrivateKey(data, chainCode, idx, harden);
            data = json.data;
            chainCode = json.chainCode;
        });
        let derivedKey = data;
        return derivedKey
    },

    i64(key, data) {
        let createHmac = require('create-hmac');
        let hmac = createHmac('sha512', key);
        hmac.update(data); //optional encoding parameter
        let i = hmac.digest(); // synchronously get result with optional encoding parameter
        return {
            secret: i.slice(0, 32),
            chainCode: i.slice(32, i.length)
        }
    },

    derivePrivateKey(privKeyBytes, chainCode, index, harden) {
        let data;
        let indexBuffer = Buffer.from([index]);
        if (harden) {
            var c = new BN(index).or(new BN(0x80000000));
            indexBuffer = c.toBuffer();

            let privKeyBuffer = Buffer.from(privKeyBytes);
            data = Buffer.from([0]);
            data = Buffer.concat([data, privKeyBuffer]);
        } else {
            const pubKey = Secp256k1.publicKeyCreate(privKeyBytes);
            // TODO
            if (index == 0) {
                indexBuffer = Buffer.from([0, 0, 0, 0]);
            }
            data = pubKey
        }
        data = Buffer.concat([data, indexBuffer]);
        let i64P = hd.i64(chainCode, Uint8Array.from(data));
        let aInt = new BN(privKeyBytes);
        let bInt = new BN(i64P.secret);
        let x = hd.addScalars(aInt, bInt);

        return {
            data: x.toBuffer(),
            chainCode: i64P.chainCode
        }
    },

    addScalars(a, b) {
        let c = a.add(b);
        const bn = require('secp256k1/lib/js/bn/index');
        let n = bn.n.toBuffer();
        let x = c.mod(new BN(n));
        return x
    },

    serialize(sig) {
        var sigObj = {r: sig.slice(0, 32), s: sig.slice(32, 64)};
        const SignatureFun = require('elliptic/lib/elliptic/ec/signature');
        let signature = new SignatureFun(sigObj);
        return signature.toDER();
    }
}