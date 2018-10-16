const utils = require('../util/utils');
const constants = require('./constants');
const amino = require('./amino');


class Validator {
    validateBasic() {
        throw new Error("not implement");
    }
}

class Msg extends Validator {
    getSignObject() {
        throw new Error("not implement");
    }

    type() {
        throw new Error("not implement");
    }
}

class Coin {
    constructor(amount, denom) {
        this.denom = denom
        this.amount = amount
    }
}

class MsgLink extends Msg {

    constructor(from, fromCid, toCid) {
        super()
        this.address = from
        this.cid1 = fromCid
        this.cid2 = toCid
    }

    getSignObject() {
        return amino.marshalJSON(this.type(), utils.sortObjectKeys(this));
    }

    validateBasic() {
        if (utils.isEmpty(this.cid1)) {
            throw new Error("from cid is empty");
        }
        if (utils.isEmpty(this.cid2)) {
            throw new Error("to cid is empty");
        }

    }

    type() {
        return "cyberd/Link";
    }
}

class Fee {
    constructor(amount, gas) {
        this.amount = amount;
        if (!gas) {
            gas = constants.CyberdNetConfig.MAXGAS;
        }
        this.gas = gas;
    }

    getSignObject() {
        if (utils.isEmpty(this.amount)) {
            this.amount = [new Coin("0", "")]
        }
        return this
    }
}


class SignMsg extends Msg {

    constructor(chainID, accnum, sequence, fee, msg, memo) {
        super();
        this.chainID = chainID;
        this.accnum = accnum;
        this.sequence = sequence;
        this.fee = fee;
        this.msgs = [msg];
        this.memo = memo;
    }

    getSignObject() {
        let msgs = [];
        this.msgs.forEach(function (msg) {
            msgs.push(msg.getSignObject())
        });

        let signObject = {
            account_number: this.accnum,
            chain_id: this.chainID,
            fee: this.fee.getSignObject(),
            memo: this.memo,
            msgs: msgs,
            sequence: this.sequence
        };
        return utils.sortObjectKeys(signObject)
    }

    validateBasic() {
        if (utils.isEmpty(this.chainID)) {
            throw new Error("chainID is empty");
        }
        if (this.accnum < 0) {
            throw new Error("accountNumber is empty");
        }
        if (this.sequence < 0) {
            throw new Error("sequence is empty");
        }
        this.msgs.forEach(function (msg) {
            msg.validateBasic();
        });
    }
}

class Signature {
    constructor(pub_key, signature, account_number, sequence) {
        this.pub_key = pub_key;
        this.signature = signature;
        this.account_number = account_number;
        this.sequence = sequence;
    }
}

class TxRequest {

    constructor(msgs, fee, signatures, memo) {
        this.msgs = msgs;
        this.fee = fee;
        this.signatures = signatures;
        this.memo = memo
    }

}

module.exports = {

    buildLinkSignMsg(acc, cidTo, cidFrom) {
        let fee = new Fee();
        let msg = new MsgLink(acc.address, cidTo, cidFrom);
        return new SignMsg(acc.chain_id, acc.account_number, acc.sequence, fee, msg, '');
    },

    buildSignature(pub_key, signature, account_number, sequence) {
        return new Signature(pub_key, signature, account_number, sequence)
    },

    buildTxRequest(msgs, fee, signatures, memo) {
        return new TxRequest(msgs, fee, signatures, memo)
    },
};