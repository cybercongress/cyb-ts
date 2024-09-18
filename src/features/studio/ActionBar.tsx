import { ActionBar } from 'src/components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSigningClient } from 'src/contexts/signerClient';
import { useBackend } from 'src/contexts/backend/backend';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import { addIfpsMessageOrCid } from 'src/utils/ipfs/helpers';
import { InputMemo } from 'src/pages/teleport/components/Inputs';
import { PATTERN_IPFS_HASH } from 'src/constants/patterns';
import { sendCyberlinkArray } from 'src/services/neuron/neuronApi';
import { KeywordsItem, useStudioContext } from './studio.context';
import { useAdviser } from '../adviser/context';
import { AdviserColors } from '../adviser/Adviser/Adviser';
import { checkLoopLinks, mapLinks, reduceLoopKeywords } from './utils/utils';

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

    const links = mapLinks(currentMarkdownCid, {
      from: keywordsFrom,
      to: keywordsTo,
    });

    const { uniqueLinks, loopLink } = await checkLoopLinks(links);

    if (loopLink.length) {
      setAdviser(
        <>
          Links with these keywords have already been created: <br />
          {reduceLoopKeywords(loopLink, [...keywordsFrom, ...keywordsTo]).join(
            ', '
          )}
        </>,
        'yellow'
      );
    }

    if (!uniqueLinks.length) {
      setTimeout(() => {
        setAdviser('try adding more unique keywords', 'yellow');
      }, 5000);
      return;
    }

    setAdviser('transaction pending...', 'yellow');
    setLoading(true);

    await sendCyberlinkArray(address, uniqueLinks, signingClient)
      .then((txHash) => {
        setTx({
          hash: txHash,
          onSuccess: () => {
            setLoading(false);
          },
        });
      })
      .catch((e) => {
        setError(e.toString());
        console.error(error);
        setLoading(false);
      });
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
          text: 'publish',
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
