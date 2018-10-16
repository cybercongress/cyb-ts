const constants = require('./constants')
const cyberdKeypair = require('./keypair')
const codec = require("../util/codec")
const cyberd = require("./message")

class Request {
    constructor(acc, toCid, fromCid, type) {
        this.acc = acc;
        this.toCid = toCid;
        this.fromCid = fromCid;
        this.type = type
    }
}

class Account {
    constructor(address, chain_id, account_number, sequence) {
        this.address = address;
        this.chain_id = chain_id;
        this.account_number = account_number;
        this.sequence = sequence
    }
}

module.exports = {
    Request,
    Account,
    builder: {
        buildTx(req) {

            if (codec.hex.isHex(req.acc.address)) {
                req.acc.address = codec.bech32.toBech32(constants.CyberdNetConfig.PREFIX_BECH32_ACCADDR, req.acc.address)
            }

            let msg;
            switch (req.type) {
                case constants.TxType.LINK: {
                    msg = cyberd.buildLinkSignMsg(req.acc, req.fromCid, req.toCid)
                    break;
                }
                default: {
                    throw new Error("not exist tx type")
                }
            }
            msg.validateBasic()
            return msg
        },

        signTx(signMsg, privateKey) {
            let sig = signMsg.signByte
            console.log("SIGN BYTES: ", sig)

            console.log("SIGN BYTES BYTES:", Buffer.from(JSON.stringify(sig)))

            let signbyte = cyberdKeypair.sign(privateKey, sig)
            let keypair = cyberdKeypair.import(privateKey)

            let signs = [cyberd.buildStdSignature(codec.hex.hexToBytes(keypair.publicKey), signbyte, signMsg.accnum, signMsg.sequence)]
            return cyberd.buildStdTx(signMsg.msgs, signMsg.fee, signs, signMsg.memo)
        },

        buildAndSignTx(req, privateKey) {
            let signMsg = this.buildTx(req)
            console.log("SIGNMESSAGE: ", signMsg)
            return this.signTx(signMsg, privateKey)
        },
    }
};