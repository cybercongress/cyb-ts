import { ActionBar, Color, Input } from 'src/components';
import { useCallback, useEffect, useState } from 'react';
import { useSigningClient } from 'src/contexts/signerClient';
import { useBackend } from 'src/contexts/backend/backend';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import { addIfpsMessageOrCid } from 'src/utils/ipfs/helpers';
import BigNumber from 'bignumber.js';
import Soft3MessageFactory from 'src/services/soft.js/api/msgs';
import { useStudioContext } from './studio.context';
import { useAdviser } from '../adviser/context';
import { AdviserColors } from '../adviser/Adviser/Adviser';

function ActionBarContainer() {
  const { signer, signingClient } = useSigningClient();
  const { isIpfsInitialized, ipfsApi } = useBackend();
  const { setAdviser } = useAdviser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [newKeywords, setNewKeywords] = useState<string>('');
  const {
    currentMarkdown,
    keywordsFrom,
    keywordsTo,
    setStateActionBar,
    stateActionBar,
    addKeywords,
  } = useStudioContext();

  const [tx, setTx] = useState({
    hash: '',
    onSuccess: () => {},
  });

  useWaitForTransaction({
    hash: tx.hash,
    onSuccess: tx.onSuccess,
  });

  const addNewKeywords = useCallback(() => {
    addKeywords(
      stateActionBar === 'keywords-from' ? 'from' : 'to',
      newKeywords
    );

    setNewKeywords('');
  }, [newKeywords, stateActionBar, addKeywords]);

  useEffect(() => {
    let content;
    let adviserColor: keyof typeof AdviserColors = 'blue';

    if (error) {
      content = error;
      adviserColor = 'red';
    } else if (loading) {
      content = 'transaction pending...';
      adviserColor = 'yellow';
    }

    setAdviser(content, adviserColor);
  }, [loading, error, setAdviser]);

  useEffect(() => {
    setError(undefined);
  }, [currentMarkdown]);

  const createCyberlinkTx = async () => {
    if (!signer || !signingClient) {
      return;
    }

    const [{ address }] = await signer.getAccounts();

    const currentMarkdownCid = await addIfpsMessageOrCid(currentMarkdown, {
      ipfsApi,
    });

    const links = [
      ...keywordsFrom.map((item) => ({
        from: item.cid,
        to: currentMarkdownCid,
      })),
      ...keywordsTo.map((item) => ({ from: currentMarkdownCid, to: item.cid })),
    ];

    const multiplier = new BigNumber(2).multipliedBy(links.length);

    const cyberlinkMsg = {
      typeUrl: '/cyber.graph.v1beta1.MsgCyberlink',
      value: {
        neuron: address,
        links,
      },
    };

    console.log('cyberlinkMsg', cyberlinkMsg);

    try {
      setLoading(true);

      const response = await signingClient.signAndBroadcast(
        address,
        [cyberlinkMsg],
        Soft3MessageFactory.fee(multiplier.toNumber())
      );

      if (response.code === 0) {
        setTx({
          hash: response.transactionHash,
          onSuccess: () => {
            setLoading(false);
          },
        });
      } else {
        setError(response.rawLog.toString());
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const isKeywords = !keywordsFrom.length && !keywordsTo.length;

  if (!isIpfsInitialized) {
    return <ActionBar>node is loading...</ActionBar>;
  }

  if (stateActionBar === 'link') {
    return (
      <ActionBar
        button={{
          text: 'link',
          disabled: isKeywords || loading || !currentMarkdown.length,
          onClick: createCyberlinkTx,
          pending: loading,
        }}
      />
    );
  }

  if (stateActionBar === 'keywords-from' || stateActionBar === 'keywords-to') {
    const textBtn = `add keywords ${
      stateActionBar === 'keywords-from' ? 'from' : 'to'
    }`;
    return (
      <ActionBar
        button={{
          text: textBtn,
          onClick: addNewKeywords,
          disabled: !newKeywords.length,
        }}
        onClickBack={() => setStateActionBar('link')}
      >
        <Input
          width="62%"
          color={Color.Pink}
          value={newKeywords}
          onChange={(e) => setNewKeywords(e.target.value)}
        />
      </ActionBar>
    );
  }

  return null;
}

export default ActionBarContainer;
