import React from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { Colors } from 'src/components/containerGradient/types';

import Display from 'src/components/containerGradient/Display/Display';

import { Input } from 'src/components/Input';
import { Button, Color, DisplayTitle } from 'src/components';
import { useBackend } from 'src/contexts/backend/backend';
import { DEFAUL_P2P_SERVICE_TOPIC } from 'src/services/ipfs/config';

import { useAdviser } from 'src/features/adviser/context';
import { PUBSUB_CHAT_MESSAGE } from 'src/services/backend/workers/background/api/p2p/types';
import styles from './drive.scss';

function P2PChat() {
  const {
    p2p: { messages },
  } = useAppSelector((store) => store.backend);
  const { p2pApi, ipfsApi, p2pSyncService } = useBackend();
  const [msg, setMsg] = React.useState('');
  const [peerAddress, setPeerAddress] = React.useState('');
  const [isPeerAddressSet, setIsPeerAddressSet] = React.useState(false);
  const { setAdviser } = useAdviser();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMsg(value);
  };

  const onSubmit = (event) => {
    if (event.key === 'Enter') {
      setMsg('');
      p2pApi?.sendPubSubMessage(DEFAUL_P2P_SERVICE_TOPIC, {
        message: msg,
        peerId: p2pApi.getMyPeerId(),
        type: PUBSUB_CHAT_MESSAGE,
      });
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
  const reAdvertise = async () => {
    const prefix = 'Re-advertising IPFS content';
    setAdviser(`${prefix}...`);
    const pins = await ipfsApi!.pins();
    const total = pins.length;
    let i = 0;
    setAdviser(`${prefix}...${pins.length} pins found`);
    // eslint-disable-next-line no-restricted-syntax
    for (const pin of pins) {
      const cid = pin.cid.toString();
      // eslint-disable-next-line no-await-in-loop
      await p2pApi!.provideContent(cid);
      i++;
      setAdviser(`${prefix}: ${cid} (${Math.round((i / total) * 100)}%)`);
    }
    setAdviser(`${prefix}: done`);
  };
  const syncPins = async () => {
    setAdviser('Syncing remote node pins...');

    const pins = await p2pSyncService.requestNodePins(peerAddress);
    console.log(`-> recieved pins from ${peerAddress}`, pins);
    const prefix = 'Fetching pins';
    const total = pins.length;
    let i = 0;
    const getPercents = () => Math.round((i / total) * 100);
    setAdviser(`${prefix} (${getPercents()}%)... `);

    // eslint-disable-next-line no-restricted-syntax
    for (const pin of pins) {
      setAdviser(`${prefix} (${getPercents()}%): ${pin}`);
      // eslint-disable-next-line no-await-in-loop
      await ipfsApi!.enqueueAndWait(pin, { priority: 1 });
      i++;
    }
    setAdviser(`${prefix}: done`);
  };
  const testConnect = async () => {
    console.log('----peerid', p2pApi?.getMyPeerId());
    const peerAddress =
      p2pApi.getMyPeerId() ===
      '12D3KooWB4KPaswRhqhuxaKiAtjezFsMKi1tDRe8tLszAvoE4huk'
        ? '/dns4/acidpictures.ink/tcp/4444/wss/p2p/12D3KooWE3yj6jibgZcxMb6hrpQGKRE9xaqAazFkYaJZDZengzHq/p2p-circuit/webrtc/p2p/12D3KooWGR5S8tyeo8Q4b88YnmTwFMbj1dAvnZSoJr4TZa4zWWYk'
        : '/dns4/acidpictures.ink/tcp/4444/wss/p2p/12D3KooWE3yj6jibgZcxMb6hrpQGKRE9xaqAazFkYaJZDZengzHq/p2p-circuit/webrtc/p2p/12D3KooWB4KPaswRhqhuxaKiAtjezFsMKi1tDRe8tLszAvoE4huk';
    setPeerAddress(peerAddress);
    p2pApi?.connectPeer(peerAddress);
  };
  return (
    <Display
      color={Colors.BLUE}
      title={<DisplayTitle title="Ipfs/p2p tools " />}
    >
      <div className={styles.subTitle}>IPFS tools</div>
      {ipfsApi && (
        <Button onClick={() => reAdvertise()}>
          Readvertise my IPFS content
        </Button>
      )}

      <div className={styles.subTitle}>direct node-to-node connect</div>
      {/* <Button onClick={() => testConnect()}>TEST</Button> */}

      <Input
        color={Color.Yellow}
        placeholder="add peer webRTC multiaddress, and press ENTER..."
        value={peerAddress}
        onChange={onChangePeerAddress}
        onKeyUp={onSubmitPeerAddress}
        disabled={isPeerAddressSet}
      />
      {isPeerAddressSet && (
        <Button onClick={() => syncPins()}>Sync remote node pins</Button>
      )}
      <div className={styles.subTitle}>p2p messaging</div>
      <div className={styles.messages}>
        {(messages[DEFAUL_P2P_SERVICE_TOPIC] || []).map((msg, index) => (
          <div
            key={`chat_${index}`}
            className={index % 2 ? styles.green1 : styles.green2}
          >
            {msg}
          </div>
        ))}
      </div>
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
