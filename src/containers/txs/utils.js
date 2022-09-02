export const checkAddress = (valueAddress, address) => {
  if (valueAddress !== address) {
    return address;
  }

  return valueAddress;
};

export const parseMsgs = (data, bech32 = '') => {
  const tempData = [...data];
  tempData.forEach((item) => {
    const { typeUrl, value } = item;
    if (typeUrl) {
      if (
        typeUrl.includes('/cyber.graph') ||
        typeUrl.includes('/cyber.resources')
      ) {
        value.neuron = checkAddress(value.neuron, bech32);
      }

      if (typeUrl.includes('MsgSend')) {
        value.fromAddress = checkAddress(value.fromAddress, bech32);
      }

      if (typeUrl.includes('staking') || typeUrl.includes('distribution')) {
        value.delegatorAddress = checkAddress(value.delegatorAddress, bech32);
      }

      if (typeUrl.includes('wasm')) {
        value.sender = checkAddress(value.sender, bech32);
      }

      if (typeUrl.includes('grid')) {
        value.source = checkAddress(value.source, bech32);
      }

      if (typeUrl.includes('MsgVote')) {
        value.voter = checkAddress(value.voter, bech32);
      }

      if (typeUrl.includes('MsgSubmitProposal')) {
        value.proposer = checkAddress(value.proposer, bech32);
      }

      if (typeUrl.includes('MsgDeposit')) {
        value.depositor = checkAddress(value.depositor, bech32);
      }

      if (typeUrl.includes('MsgSwapWithinBatch')) {
        value.swapRequesterAddress = checkAddress(
          value.swapRequesterAddress,
          bech32
        );
      }

      if (typeUrl.includes('MsgDepositWithinBatch')) {
        value.depositorAddress = checkAddress(value.depositorAddress, bech32);
      }

      if (typeUrl.includes('MsgWithdrawWithinBatch')) {
        value.withdrawerAddress = checkAddress(value.withdrawerAddress, bech32);
      }

      if (typeUrl.includes('MsgCreatePool')) {
        value.poolCreatorAddress = checkAddress(
          value.poolCreatorAddress,
          bech32
        );
      }
    }
  });

  return tempData;
};
