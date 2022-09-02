import { toUtf8 } from '@cosmjs/encoding';

class Msgs {
  cyberlink = (neuron, from, to) => {
    const cyberlinkMsg = {
      typeUrl: '/cyber.graph.v1beta1.MsgCyberlink',
      value: {
        neuron,
        links: [{ from, to }],
      },
    };

    return cyberlinkMsg;
  };

  // Resources module

  investmint = async (senderAddress, amount, resource, length) => {
    const investmintMsg = {
      typeUrl: '/cyber.resources.v1beta1.MsgInvestmint',
      value: {
        neuron: senderAddress,
        amount,
        resource,
        length: length.toString(),
      },
    };
    return investmintMsg;
  };

  sendTokens = (senderAddress, recipientAddress, amount) => {
    const sendMsg = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: senderAddress,
        toAddress: recipientAddress,
        amount,
      },
    };
    return sendMsg;
  };

  // Distribution module

  delegateTokens = async (delegatorAddress, validatorAddress, amount) => {
    const delegateMsg = {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: {
        delegatorAddress,
        validatorAddress,
        amount,
      },
    };
    return delegateMsg;
  };

  redelegateTokens = async (
    delegatorAddress,
    validatorSrcAddress,
    validatorDstAddress,
    amount
  ) => {
    const redelegateMsg = {
      typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      value: {
        delegatorAddress,
        validatorSrcAddress,
        validatorDstAddress,
        amount,
      },
    };
    return redelegateMsg;
  };

  undelegateTokens = async (delegatorAddress, validatorAddress, amount) => {
    const undelegateMsg = {
      typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
      value: {
        delegatorAddress,
        validatorAddress,
        amount,
      },
    };
    return undelegateMsg;
  };

  withdrawRewards = async (delegatorAddress, validatorAddress) => {
    const withdrawDelegatorRewardMsg = {
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: {
        delegatorAddress,
        validatorAddress,
      },
    };
    return withdrawDelegatorRewardMsg;
  };

  withdrawAllRewards = async (delegatorAddress, validatorAddresses) => {
    const msgs = validatorAddresses.map((validatorAddress) => {
      return {
        typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        value: {
          delegatorAddress,
          validatorAddress,
        },
      };
    });

    return msgs;
  };

  executeArray = async (senderAddress, contractAddress, msg, funds) => {
    const msgs = msg.map((item) => ({
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: {
        sender: senderAddress,
        contract: contractAddress,
        msg: toUtf8(JSON.stringify(item)),
        funds: [...(funds || [])],
      },
    }));

    return msgs;
  };

  voteProposal = async (voter, proposalId, option) => {
    const voteMsg = {
      typeUrl: '/cosmos.gov.v1beta1.MsgVote',
      value: {
        proposalId,
        voter,
        option,
      },
    };
    return voteMsg;
  };

  submitProposal = async (proposer, content, initialDeposit) => {
    const sumbitProposalMsg = {
      typeUrl: '/cosmos.gov.v1beta1.MsgSubmitProposal',
      value: {
        content: {
          typeUrl: content.typeUrl,
          value: Uint8Array.from(content.value),
        },
        initialDeposit,
        proposer,
      },
    };
    return sumbitProposalMsg;
  };

  depositProposal = async (depositor, proposalId, amount) => {
    const depositMsg = {
      typeUrl: '/cosmos.gov.v1beta1.MsgDeposit',
      value: {
        depositor,
        proposalId,
        amount,
      },
    };
    return depositMsg;
  };

  // Liquidity module

  swapWithinBatch = async (
    swapRequesterAddress,
    poolId,
    swapTypeId,
    offerCoin,
    demandCoinDenom,
    offerCoinFee,
    orderPrice
  ) => {
    const swapWithinBatchMsg = {
      typeUrl: '/tendermint.liquidity.v1beta1.MsgSwapWithinBatch',
      value: {
        swapRequesterAddress,
        poolId,
        swapTypeId,
        offerCoin,
        demandCoinDenom,
        offerCoinFee,
        orderPrice,
      },
    };
    // console.log(swapWithinBatchMsg);
    return swapWithinBatchMsg;
  };

  depositWithinBatch = async (depositorAddress, poolId, depositCoins) => {
    const depositWithinBatchMsg = {
      typeUrl: '/tendermint.liquidity.v1beta1.MsgDepositWithinBatch',
      value: {
        depositorAddress,
        poolId,
        depositCoins,
      },
    };
    // console.log(depositWithinBatchMsg);
    return depositWithinBatchMsg;
  };

  withdwawWithinBatch = async (withdrawerAddress, poolId, poolCoin) => {
    const withdrawWithinBatchMsg = {
      typeUrl: '/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch',
      value: {
        withdrawerAddress,
        poolId,
        poolCoin,
      },
    };
    // console.log(withdrawWithinBatchMsg);
    return withdrawWithinBatchMsg;
  };

  createPool = async (poolCreatorAddress, poolTypeId, depositCoins) => {
    const createPoolMsg = {
      typeUrl: '/tendermint.liquidity.v1beta1.MsgCreatePool',
      value: {
        poolCreatorAddress,
        poolTypeId,
        depositCoins,
      },
    };
    // console.log(createPoolMsg);
    return createPoolMsg;
  };

  // Energy module

  createEnergyRoute = async (senderAddress, destination, name) => {
    const createEnergyRouteMsg = {
      typeUrl: '/cyber.grid.v1beta1.MsgCreateRoute',
      value: {
        source: senderAddress,
        destination,
        name,
      },
    };
    return createEnergyRouteMsg;
  };

  editEnergyRoute = async (senderAddress, destination, value) => {
    const editEnergyRouteMsg = {
      typeUrl: '/cyber.grid.v1beta1.MsgEditRoute',
      value: {
        source: senderAddress,
        destination,
        value,
      },
    };
    return editEnergyRouteMsg;
  };

  deleteEnergyRoute = async (senderAddress, destination) => {
    const deleteEnergyRouteMsg = {
      typeUrl: '/cyber.grid.v1beta1.MsgDeleteRoute',
      value: {
        source: senderAddress,
        destination,
      },
    };
    return deleteEnergyRouteMsg;
  };

  editEnergyRouteName = async (senderAddress, destination, name) => {
    const editEnergyRouteNameMsg = {
      typeUrl: '/cyber.grid.v1beta1.MsgEditRouteName',
      value: {
        source: senderAddress,
        destination,
        name,
      },
    };

    return editEnergyRouteNameMsg;
  };
}

export default Msgs;
