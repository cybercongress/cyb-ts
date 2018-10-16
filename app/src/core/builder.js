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
        buildSignMsg(req) {

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

        signTxRequest(signMsg, privateKey) {

            let objectToSign = signMsg.getSignObject()

            let signedBytes = cyberdKeypair.sign(privateKey, objectToSign)
            let keypair = cyberdKeypair.import(privateKey)

            let signs = [cyberd.buildSignature(codec.hex.hexToBytes(keypair.publicKey), signedBytes, signMsg.accnum, signMsg.sequence)]
            return cyberd.buildTxRequest(signMsg.msgs, signMsg.fee, signs, signMsg.memo)
        },

        buildAndSignTxRequest(req, privateKey) {
            let signMsg = this.buildSignMsg(req)
            return this.signTxRequest(signMsg, privateKey)
        },
    }
};