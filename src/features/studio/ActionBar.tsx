import { ActionBar } from 'src/components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSigningClient } from 'src/contexts/signerClient';
import { useBackend } from 'src/contexts/backend/backend';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import { addIfpsMessageOrCid } from 'src/utils/ipfs/helpers';
import BigNumber from 'bignumber.js';
import Soft3MessageFactory from 'src/services/soft.js/api/msgs';
import { InputMemo } from 'src/pages/teleport/components/Inputs';
import { PATTERN_IPFS_HASH } from 'src/constants/patterns';
import { KeywordsItem, useStudioContext } from './studio.context';
import { useAdviser } from '../adviser/context';
import { AdviserColors } from '../adviser/Adviser/Adviser';

function ActionBarContainer() {
  const { signer, signingClient } = useSigningClient();
  const { isIpfsInitialized, ipfsApi } = useBackend();
  const { setAdviser } = useAdviser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [newKeywords, setNewKeywords] = useState<
    | {
        value: string;
        fileName?: string;
      }
    | undefined
  >();

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

  const addNewKeywords = useCallback(async () => {
    if (!newKeywords?.value || !ipfsApi) {
      return;
    }

    const { value, fileName } = newKeywords;

    const newItem: KeywordsItem[] = [];

    if (value.match(PATTERN_IPFS_HASH)) {
      newItem.push({ text: fileName || value, cid: value });
    } else {
      const arrValue = value.split(',');

      for (let index = 0; index < arrValue.length; index++) {
        const item = arrValue[index];
        // eslint-disable-next-line no-await-in-loop
        const itemCid = await addIfpsMessageOrCid(item, { ipfsApi });

        newItem.push({ text: item, cid: itemCid });
      }
    }

    addKeywords(stateActionBar === 'keywords-from' ? 'from' : 'to', newItem);

    setNewKeywords(undefined);
    setStateActionBar('link');
  }, [newKeywords, ipfsApi, addKeywords, stateActionBar, setStateActionBar]);

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

  const isDisabledLink = useMemo(() => {
    const isKeywords = ![...keywordsFrom, ...keywordsTo].length;

    return isKeywords || loading || !currentMarkdown.length;
  }, [currentMarkdown, keywordsFrom, keywordsTo, loading]);

  if (!isIpfsInitialized) {
    return <ActionBar>node is loading...</ActionBar>;
  }

  if (stateActionBar === 'link') {
    return (
      <ActionBar
        button={{
          text: 'link',
          disabled: isDisabledLink,
          onClick: createCyberlinkTx,
          pending: loading,
        }}
      />
    );
  }

  if (stateActionBar === 'keywords-from' || stateActionBar === 'keywords-to') {
    const textBtn = `add ${
      stateActionBar === 'keywords-from' ? 'incoming' : 'outcoming'
    } link(s)`;
    return (
      <ActionBar
        button={{
          text: textBtn,
          onClick: addNewKeywords,
          disabled: !newKeywords?.value.length,
        }}
        onClickBack={() => setStateActionBar('link')}
      >
        <InputMemo
          title="type keywords"
          value={newKeywords?.value || ''}
          onChangeValue={(value, fileName) =>
            setNewKeywords({ value, fileName })
          }
        />
      </ActionBar>
    );
  }

  return null;
}

export default ActionBarContainer;
