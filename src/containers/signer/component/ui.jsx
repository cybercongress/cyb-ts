import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pane, Button, Tablist } from '@cybercongress/gravity';
import MsgType from '../../txs/msgType';
import { PillNumber, TabBtn, Dots } from '../../../components';
import { trimString } from '../../../utils/utils';

const HeaderSigner = ({ children }) => (
  <Pane
    fontSize="18px"
    textAlign="center"
    borderBottom="1px solid #ffffff52"
    paddingY={10}
  >
    {children}
  </Pane>
);

function StateSign({ msgData, onClick, onClickReject }) {
  const [selected, setSelected] = useState('details');

  let content;

  if (selected === 'details' && msgData !== null) {
    content = (
      <Pane overflow="auto" width="100%" paddingY={5} paddingX={10}>
        <Pane display="flex">
          Messages{' '}
          <PillNumber marginLeft={5} height="20px">
            {Object.keys(msgData).length}
          </PillNumber>{' '}
        </Pane>
        <Pane width="100%" paddingLeft={20}>
          {Object.keys(msgData).map((key) => (
            <Pane paddingY={5} width="100%">
              <MsgType type={msgData[key].type} />
              {/* {msgData[key].type} */}
              <Pane borderBottom="1px solid #ffffff52" />
            </Pane>
          ))}
        </Pane>
      </Pane>
    );
  }

  if (selected === 'data' && msgData !== null) {
    content = (
      <Pane width="100%" overflow="auto">
        <pre>{JSON.stringify(msgData, null, 2)}</pre>
      </Pane>
    );
  }

  return (
    <Pane
      position="fixed"
      backgroundColor="#6b696954"
      zIndex="999999"
      top={0}
      bottom={0}
      right={0}
      left={0}
    >
      <Pane className="signer-container">
        <HeaderSigner>sign tx</HeaderSigner>
        <Pane
          display="flex"
          height="100%"
          width="100%"
          alignItems="flex-start"
          paddingY={10}
          flexDirection="column"
          overflow="hidden"
        >
          <Tablist
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
            gridGap="10px"
            marginBottom={10}
            width="100%"
            paddingX={20}
            paddingTop={5}
          >
            <TabBtn
              key="details"
              isSelected={selected === 'details'}
              text="details"
              onClick={() => setSelected('details')}
            />
            <TabBtn
              key="data"
              isSelected={selected === 'data'}
              text="data"
              onClick={() => setSelected('data')}
            />
          </Tablist>
          {content}
        </Pane>
        <Pane display="flex" justifyContent="center" paddingY={10}>
          <Button marginX={10} onClick={() => onClickReject()}>
            reject
          </Button>
          <Button marginX={10} onClick={() => onClick()}>
            sign
          </Button>
        </Pane>
      </Pane>
    </Pane>
  );
}

function StateBroadcast() {
  return (
    <Pane className="signer-container">
      <HeaderSigner>Broadcast txs</HeaderSigner>
      <Pane position="relative" height="100%">
        <Pane position="absolute" top="20%" paddingX={20} fontSize="18px">
          Please wait while we confirm the transaction on the blockchain{' '}
          <Dots big />
        </Pane>
      </Pane>
    </Pane>
  );
}

function StateConfirmed({ txHash, onClick }) {
  return (
    <Pane className="signer-container">
      <HeaderSigner>Confirmed</HeaderSigner>
      <Pane position="relative" height="100%">
        <Pane
          position="absolute"
          top="20%"
          paddingX={20}
          whiteSpace="nowrap"
          fontSize="18px"
        >
          Transaction hash:{' '}
          <Link to={`/network/euler/tx/${txHash}`}>
            {trimString(txHash, 6, 6)}
          </Link>
        </Pane>
      </Pane>
      <Pane
        paddingY={10}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button onClick={() => onClick()}>Fuck Google</Button>
      </Pane>
    </Pane>
  );
}

function StateInitAccount({ onClickCreateNew, onClickRestore }) {
  return (
    <Pane className="signer-container">
      <HeaderSigner>Init Account</HeaderSigner>
      <Pane position="relative" height="100%">
        <Pane
          position="absolute"
          top="20%"
          fontSize="18px"
          width="100%"
          display="grid"
          gridTemplateColumns="200px"
          gridAutoRows="50px 50px"
          gridGap="20px"
          justifyContent="center"
        >
          <Button onClick={() => onClickCreateNew()}>create new</Button>
          <Button onClick={() => onClickRestore()}>restore phrase</Button>
        </Pane>
      </Pane>
    </Pane>
  );
}

function StateRestore({ valuePhrase, onChangeInputPhrase, onClick }) {
  return (
    <Pane className="signer-container">
      <HeaderSigner>Restore phrase</HeaderSigner>
      <Pane position="relative" height="100%">
        <Pane
          position="absolute"
          top="10%"
          width="100%"
          paddingX={20}
          fontSize="18px"
        >
          <Pane paddingY={10}>Input your seed :</Pane>
          <textarea
            style={{ minHeight: '130px', padding: '8px' }}
            onChange={onChangeInputPhrase}
            value={valuePhrase}
            className="resize-none"
            placeholder="Type your mnemonic"
          />
        </Pane>
      </Pane>
      <Pane
        paddingY={10}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button onClick={() => onClick()}>Fuck Google</Button>
      </Pane>
    </Pane>
  );
}

function StateCreateNew({ valuePhrase = '', onClick }) {
  const [copyPhrase, setCopyPhrase] = useState(false);

  return (
    <Pane className="signer-container">
      <HeaderSigner>Create new account</HeaderSigner>
      <Pane position="relative" height="100%">
        <Pane paddingX={20} fontSize="18px">
          <Pane textAlign="center" paddingY={10} fontWeight="600">
            Backup your mnemonic seed securely.
          </Pane>
          <Pane paddingY={10}>Mnemonic Seed:</Pane>
          <textarea
            style={{ minHeight: '130px', padding: '8px' }}
            value={valuePhrase}
            className="resize-none"
          />
          <Pane display="flex" alignItems="center" marginTop={30}>
            <input
              type="checkbox"
              style={{ marginRight: '8px' }}
              className="checkbox"
              onChange={() => setCopyPhrase(!copyPhrase)}
            />{' '}
            I saved the mnemonic phrase
          </Pane>
        </Pane>
      </Pane>
      <Pane
        paddingY={10}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button disabled={!copyPhrase} onClick={() => onClick()}>
          Fuck Google
        </Button>
      </Pane>
    </Pane>
  );
}

export {
  StateSign,
  StateBroadcast,
  StateConfirmed,
  StateInitAccount,
  StateCreateNew,
  StateRestore,
};
