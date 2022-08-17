import React, { useCallback, useContext } from 'react';
import txs from '../utils/txs';
import { GasPrice } from '@cosmjs/launchpad';
import { CONTRACT_ADDRESS_GIFT } from '../utils';
import { AppContext } from '../../../context';

const gasPrice = GasPrice.fromString('0.001boot');

const claimMsg = (address, amount, proof, nickname) => {
  return {
    claim: {
      proof,
      gift_amount: amount,
      gift_claiming_address: address,
      nickname,
    },
  };
};

const releaseMsg = (address) => {
  return {
    release: {
      gift_address: address,
    },
  };
};

function ActionBarClaimGift({
  currentGift,
  citizenship,
  selectedAddress,
  updateTxHash,
}) {
  const { keplr } = useContext(AppContext);

  const claimCallback = useCallback(async () => {
    if (keplr !== null && citizenship !== null && currentGift !== null) {
      const { nickname } = citizenship.extension;
      const { address, amount, proof } = currentGift;
      const msgObject = claimMsg(address, amount, proof, nickname);

      try {
        const [{ address: addressKeplr }] = await keplr.signer.getAccounts();
        const executeResponseResult = await keplr.execute(
          addressKeplr,
          CONTRACT_ADDRESS_GIFT,
          msgObject,
          txs.calculateFee(400000, gasPrice),
          'cyber'
        );
        console.log('executeResponseResult', executeResponseResult);
        if (executeResponseResult.code === 0) {
          updateTxHash({
            status: 'pending',
            txHash: executeResponseResult.transactionHash,
          });
          // setStep(STEP_INIT);
        }
      } catch (error) {
        console.log('error', error);
        // setStep(STEP_INIT);
      }
    }
  }, [keplr, citizenship, currentGift]);

  const releaseCallback = useCallback(async () => {
    if (keplr !== null && selectedAddress !== null) {
      const msgObject = releaseMsg(selectedAddress);

      try {
        const [{ address }] = await keplr.signer.getAccounts();
        const executeResponseResult = await keplr.execute(
          address,
          CONTRACT_ADDRESS_GIFT,
          msgObject,
          txs.calculateFee(400000, gasPrice),
          'cyber'
        );
        console.log('executeResponseResult', executeResponseResult);
        if (executeResponseResult.code === 0) {
          updateTxHash({
            status: 'pending',
            txHash: executeResponseResult.transactionHash,
          });
          // setStep(STEP_INIT);
        }
      } catch (error) {
        console.log('error', error);
        // setStep(STEP_INIT);
      }
    }
  }, [keplr, selectedAddress]);

  return <div>ActionBarClaimGift</div>;
}

export default ActionBarClaimGift;
