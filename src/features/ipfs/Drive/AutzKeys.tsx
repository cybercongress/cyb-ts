import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { Colors } from 'src/components/containerGradient/types';

import Display from 'src/components/containerGradient/Display/Display';

import styles from './drive.scss';
import { Button, Input } from 'src/components';
import { generateWalletFromMnemonic } from 'src/services/wallet/walletGenerator';
import {
  createSignerClient,
  useSigningClient,
} from 'src/contexts/signerClient';

import { CYBER } from 'src/utils/config';
import { NeuronAddress } from 'src/types/base';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { defaultFee } from 'src/services/neuron/neuronApi';
import { makeClientWithAuthz } from './queries';
import { coins } from '@cosmjs/launchpad';
import axios from 'axios';
import { useBackend } from 'src/contexts/backend/backend';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { MsgCyberlink } from '@cybercongress/cyber-js/build/codec/cyber/graph/v1beta1/tx';
import { MsgExec } from 'cosmjs-types/cosmos/authz/v1beta1/tx';

/*
https://lcd.bostrom.cybernode.ai/cosmos/authz/v1beta1/grants/grantee/bostrom1a3zu6emqfzkc6rz9a44mq2ks88dmgvjrfcq6jl

https://lcd.bostrom.cybernode.ai/cosmos/authz/v1beta1/grants/granter/bostrom1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjwxgd445

https://lcd.bostrom.cybernode.ai/cosmos/authz/v1beta1/grants?granter=bostrom1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjwxgd445&grantee=bostrom1a3zu6emqfzkc6rz9a44mq2ks88dmgvjrfcq6jl
*/
const getGranters = async (address: NeuronAddress) => {
  return axios({
    method: 'get',
    url: `${CYBER.CYBER_NODE_URL_LCD}/cosmos/authz/v1beta1/grants/grantee/${address}`,
  });
};

const getGrantees = async (address: NeuronAddress) => {
  return axios({
    method: 'get',
    url: `${CYBER.CYBER_NODE_URL_LCD}/cosmos/authz/v1beta1/grants/granter/${address}`,
  });
};

const getGrants = async (granter: NeuronAddress, grantee: NeuronAddress) => {
  return axios({
    method: 'get',
    url: `${CYBER.CYBER_NODE_URL_LCD}/cosmos/authz/v1beta1/grants?granter=${granter}&grantee=${grantee}`,
  });
};

const mnemonic =
  'picture check person they response slam post cement moon sorry nuclear price knock figure sugar distance remember lunar powder balance bleak weasel cherry review';
function AutzKeys() {
  const { ipfsApi, senseApi } = useBackend();
  const [address, setAddress] = React.useState<string | null>(null);
  const [grantees, setGrantees] = React.useState<string[]>([]);
  const [testLink, setTestLink] = React.useState<string>(
    new Date().toISOString()
  );
  const [autzSigner, setAutzSigner] = useState<
    SigningCyberClient | undefined
  >();

  // const [grants, setGrants] = React.useState<string[]>([]);
  const { signingClient, signer, signerReady } = useSigningClient();
  const myAddress = useAppSelector(selectCurrentAddress);
  const loadGrantees = useCallback(async () => {
    const grantees = await getGrantees(myAddress);
    setGrantees(grantees.data.grants);
    console.log('----grantees', grantees.data.grants);
  }, [myAddress]);

  useEffect(() => {
    (async () => {
      if (myAddress) {
        const { wallet, address } = await generateWalletFromMnemonic(mnemonic);
        const autzSigner = await createSignerClient(wallet);
        setAutzSigner(autzSigner);

        setAddress(address);
        await loadGrantees();
        // const granters = await getGranters(myAddress);
        // console.log('----grantees', granters.data.grants);
        // setGranters(granters.data.grants);

        // const grants = await getGrants(myAddress, address);
        // console.log('----grants', grants.data.grants);
        // setGrants(grants.data.grants);
      }
    })();
  }, [myAddress]);

  const onGrantClick = async () => {
    if (myAddress && address) {
      const sendMsg = {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          fromAddress: myAddress,
          toAddress: address,
          amount: coins(1, 'boot'),
        },
      };
      // const thirtyDaysInFuture = new Date(
      //   Date.now() + 30 * 24 * 60 * 60 * 1000
      // );
      // const expirationTimestamp = toTimestamp(thirtyDaysInFuture);

      // const seconds = BigInt(
      //   Math.round(thirtyDaysInFuture.getTime()).toString()
      // );

      // Create the Timestamp object with bigint values
      // const expirationTimestamp = Timestamp.fromPartial({
      //   seconds,
      //   nanos: 0,
      // });
      const expirationTimestamp = Math.floor(
        Date.parse('2024-05-01T18:52:56.449Z') / 1000
      );
      const grantedMsg = '/cyber.graph.v1beta1.MsgCyberlink';

      const grant = {
        authorization: {
          typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
          value: GenericAuthorization.encode(
            GenericAuthorization.fromPartial({
              msg: grantedMsg,
            })
          ).finish(),
        },
        expiration: { seconds: expirationTimestamp, nano: 0 },
      };

      const grantMsg = {
        typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
        value: {
          granter: myAddress,
          grantee: address,
          grant,
        },
      };

      const result = await signingClient?.signAndBroadcast(
        myAddress,
        [sendMsg, grantMsg],
        defaultFee
      );
      await loadGrantees();
      console.log('----onGrantClick', result);
    }
  };

  const onRevokeClick = async () => {
    console.log('-----revoke', grantees);
    const result = await Promise.all(
      grantees.map(
        async (grant) =>
          grant.grantee === address &&
          signingClient!.revoke(
            myAddress,
            address,
            grant.authorization.msg,
            defaultFee
          )
      )
    );
    console.log('----onRevokeClick', result);

    await loadGrantees();
  };

  const onTestLink = async () => {
    if (myAddress && address) {
      const fromCid = await ipfsApi?.addContent('test-autz');

      const toCid = await ipfsApi?.addContent(testLink);
      console.log('----test link', fromCid, toCid);

      const actionMsg = {
        typeUrl: '/cyber.graph.v1beta1.MsgCyberlink', // For example, sending tokens
        value: MsgCyberlink.encode(
          MsgCyberlink.fromPartial({
            neuron: myAddress,
            links: [
              {
                from: fromCid,
                to: toCid,
              },
            ],
          })
        ).finish(),
      };

      // Step 3: Wrap the action message in a MsgExec message
      const execMsg = {
        typeUrl: '/cosmos.authz.v1beta1.MsgExec',
        value: {
          grantee: address, // The grantee's address
          msgs: [actionMsg], // The message to be executed on behalf of the granter
        },
      };

      // Step 4: Sign and broadcast the MsgExec transaction
      const execResult = await autzSigner!.signAndBroadcast(
        address, // The grantee signs the transaction
        [execMsg], // The MsgExec message
        defaultFee, // Fee for the transaction
        'Executing action on behalf of granter 2w2' // Memo
      );
      console.log('----test link result', execResult, execMsg);
      // await sendCyberlink(myAddress, fromCid, toCid, deps);
    }
  };

  return (
    <Display color={Colors.GREEN}>
      <div className={styles.list}>
        <h3>Autz keys</h3>
        <div>Mnemonic: {mnemonic}</div>
        <div>Address: {address}</div>
        {/* <div>Granters:</div>
        <ul>
          {granters.map((data, index) => (
            <li key={`grantees_${index}`}>
              {data.granter} to {data.grantee} - {data.authorization.msg}: (
              {data.expiration})
            </li>
          ))}
        </ul> */}
        <div>Grantees:</div>
        <ul>
          {grantees.map((data, index) => (
            <li key={`grantees_${index}`}>
              {data.granter} to {data.grantee} - {data.authorization.msg}: (
              {data.expiration})
            </li>
          ))}
        </ul>
        {/* <div>Grants:</div>
        <ul>
          {grants.map((data, index) => (
            <li key={`grant_${index}`}>
              {data.authorization.msg}: ({data.expiration})
            </li>
          ))}
        </ul> */}
        <div className={styles.buttonPanel}>
          <Button small onClick={onGrantClick}>
            grant link rights
          </Button>
          <span> </span>
          <Button small onClick={onRevokeClick}>
            revoke rights
          </Button>{' '}
        </div>
        <div className={styles.buttonPanel}>
          <Input
            value={testLink}
            onChange={(v) => setTestLink(v.target.value)}
            placeholder="any text"
          />
          <Button small onClick={onTestLink}>
            link to test-autz
          </Button>
        </div>
      </div>
    </Display>
  );
}

export default AutzKeys;
