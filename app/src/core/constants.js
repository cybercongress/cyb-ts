class TxType {
}

TxType.LINK = "link"

class CyberdNetConfig {
}

CyberdNetConfig.MAXGAS = 20000000
CyberdNetConfig.PREFIX_BECH32_ACCADDR = "cosmosaccaddr"
CyberdNetConfig.PREFIX_BECH32_ACCPUB = "cosmosaccpub"
CyberdNetConfig.ENCODING_BECH32 = "bech32"
CyberdNetConfig.ENCODING_HEX = "hex"
CyberdNetConfig.DEFAULT_ENCODING = CyberdNetConfig.ENCODING_BECH32
CyberdNetConfig.CHAIN_ID = "test-chain-8zgDHh"

class AminoKey {
}

AminoKey.BIP44Prefix = "44'/118'/"
AminoKey.FullFundraiserPath = AminoKey.BIP44Prefix + "0'/0/0"

module.exports = {TxType, CyberdNetConfig: CyberdNetConfig, AminoKey}
