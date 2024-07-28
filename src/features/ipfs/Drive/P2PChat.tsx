import React from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { Colors } from 'src/components/containerGradient/types';

import Display from 'src/components/containerGradient/Display/Display';

import { Input } from 'src/components/Input';
import { Color, DisplayTitle } from 'src/components';
import { useBackend } from 'src/contexts/backend/backend';
import { DEFAUL_P2P_TOPIC } from 'src/services/ipfs/config';

import styles from './drive.scss';

function P2PChat() {
  const {
    p2p: { messages },
  } = useAppSelector((store) => store.backend);
  const { p2pApi } = useBackend();
  const [msg, setMsg] = React.useState('');
  const [peerAddress, setPeerAddress] = React.useState('');
  const [isPeerAddressSet, setIsPeerAddressSet] = React.useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMsg(value);
  };

  const onSubmit = (event) => {
    if (event.key === 'Enter') {
      setMsg('');
      p2pApi?.sendPubSubMessage(DEFAUL_P2P_TOPIC, msg);
    }
  };

  const onChangePeerAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPeerAddress(value);
  };

  const onSubmitPeerAddress = (event) => {
    if (event.key === 'Enter') {
      setIsPeerAddressSet(true);
      p2pApi?.connectPeer(peerAddress);
    }
  };

  return (
    <Display
      color={Colors.BLUE}
      title={<DisplayTitle title="cyb comm (p2p experemental) " />}
    >
      <div className={styles.messages}>
        {(messages[DEFAUL_P2P_TOPIC] || []).map((msg, index) => (
          <div
            key={`chat_${index}`}
            className={index % 2 ? styles.green1 : styles.green2}
          >
            {msg}
          </div>
        ))}
      </div>
      <Input
        color={Color.Yellow}
        placeholder="add peer webRTC multiaddress, and press ENTER..."
        value={peerAddress}
        onChange={onChangePeerAddress}
        onKeyUp={onSubmitPeerAddress}
        disabled={isPeerAddressSet}
      />
      {isPeerAddressSet && (
        <Input
          color={Color.Yellow}
          placeholder="message something to broadcast and press ENTER..."
          value={msg}
          onChange={onChange}
          onKeyUp={onSubmit}
        />
      )}
    </Display>
  );
}

export default P2PChat;
