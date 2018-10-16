let {TypeFactory, Types} = require('../amino/index')

let PubKeySecp256k1 = TypeFactory.create('PubKeySecp256k1', [{
    name: "a",
    type: Types.ByteSlice
}], Types.ByteSlice)

let MsgLink = TypeFactory.create('MsgLink', [
    {
        name: "address",
        type: Types.String
    },
    {
        name: "cid1",
        type: Types.String
    },
    {
        name: "cid2",
        type: Types.String
    }
])

let StdFee = TypeFactory.create('StdFee', [
    {
        name: "amount",
        type: Types.Struct
    },
    {
        name: "gas",
        type: Types.Int64
    }
])

let Coin = TypeFactory.create('Coin', [
    {
        name: "denom",
        type: Types.String
    },
    {
        name: "amount",
        type: Types.Int64
    }
])

let StdSignature = TypeFactory.create('StdSignature', [
    {
        name: "pub_key",
        type: Types.Interface
    },
    {
        name: "signature",
        type: Types.ByteSlice
    },
    {
        name: "account_number",
        type: Types.Int64
    },
    {
        name: "sequence",
        type: Types.Int64
    }
])

let StdTx = TypeFactory.create('StdTx', [
    {
        name: "msg",
        type: Types.Struct
    },
    {
        name: "signature",
        type: Types.Struct
    },
    {
        name: "memo",
        type: Types.String
    },
    {
        name: "fee",
        type: Types.Struct
    }
])

module.exports = {
    MsgLink, PubKeySecp256k1, Coin, StdFee, StdSignature, StdTx
}