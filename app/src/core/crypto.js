const keypair = require('./keypair')
const codec = require("../util/codec")
const utils = require("../util/utils")
const constants = require('./constants').CyberdNetConfig


function encode(acc) {
    if (!utils.isEmpty(acc)) {
        let defaultCoding = constants.DEFAULT_ENCODING
        switch (defaultCoding) {
            case constants.ENCODING_BECH32: {
                if (codec.hex.isHex(acc.address)) {
                    acc.address = codec.bech32.toBech32(constants.PREFIX_BECH32_ACCADDR, acc.address)
                }
                if (codec.hex.isHex(acc.publicKey)) {
                    acc.publicKey = codec.bech32.toBech32(constants.PREFIX_BECH32_ACCPUB, acc.publicKey)
                }
            }
        }
        return acc
    }
}

module.exports = {

    /**
     *
     * @param language
     * @returns {*}
     */
    create(language) {
        let keyPair = keypair.create()
        if (keyPair) {
            return encode({
                address: keyPair.address,
                phrase: keyPair.secret,
                privateKey: keyPair.privateKey,
                publicKey: keyPair.publicKey
            })
        }
        return keyPair
    },

    recover(secret, language) {
        let keyPair = keypair.recover(secret)
        if (keyPair) {
            return encode({
                address: keyPair.address,
                phrase: secret,
                privateKey: keyPair.privateKey,
                publicKey: keyPair.publicKey
            })
        }
    },

    import(privateKey) {
        let keyPair = keypair.import(privateKey)
        if (keyPair) {
            return encode({
                address: keyPair.address,
                phrase: null,
                privateKey: keyPair.privateKey,
                publicKey: keyPair.publicKey
            })
        }
    },

    isValidAddress(address) {
        return keypair.isValidAddress(address)
    },

    isValidPrivate(privateKey) {
        return keypair.isValidPrivate(privateKey)
    },

    getAddress(publicKey) {
        let pubKey = codec.hex.hexToBytes(publicKey)
        let address = keypair.getAddress(pubKey)
        address = codec.bech32.toBech32(constants.PREFIX_BECH32_ACCADDR, address)
        return address
    }
}