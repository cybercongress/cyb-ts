import React from 'react';
import { Pane, ActionBar, Button } from '@cybercongress/gravity';

function ActionBarWeb3({ web3, accountsETH }) {
  const onClickConnect = async () => {
    if (web3.currentProvider.host) {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      await web3.eth.getAccounts();
    } else {
      console.log('Your metamask is locked!');
    }
  };

  if (accountsETH === undefined) {
    return (
      <ActionBar>
        <Pane>
          <Button onClick={onClickConnect}>Connect</Button>
        </Pane>
      </ActionBar>
    );
  }

  return null;
}

export default ActionBarWeb3;
