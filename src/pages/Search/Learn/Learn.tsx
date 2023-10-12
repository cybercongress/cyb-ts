import { Link, useNavigate } from 'react-router-dom';
import { ActionBar, Button, Input, MainContainer } from 'src/components';
import { routes } from 'src/routes';
import TitleText from '../TitleText/TitleText';
import styles from './Learn.module.scss';
import KeywordButton from '../KeywordButton/KeywordButton';
import { useEffect, useState } from 'react';
import { DEFAULT_GAS_LIMITS, PATTERN_IPFS_HASH } from 'src/utils/config';
import { addContenToIpfs } from 'src/utils/ipfs/utils-ipfs';
import { useIpfs } from 'src/contexts/ipfs';
import { useAdviser } from 'src/features/adviser/context';
import Loading from '../../../components/ui/Loading';
import { useQueryClient } from 'src/contexts/queryClient';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useSelector } from 'react-redux';
import { useSigningClient } from 'src/contexts/signerClient';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';

function Learn() {
  const [ask, setAsk] = useState('');
  const [answer, setAnswer] = useState('');

  const [loading, setLoading] = useState(false);

  const { node } = useIpfs();
  const queryClient = useQueryClient();

  const { signer, signingClient } = useSigningClient();
  const navigate = useNavigate();

  const [tx, setTx] = useState({
    hash: '',
    onSuccess: () => {},
  });

  useWaitForTransaction({
    hash: tx.hash,
    onSuccess: tx.onSuccess,
  });

  const address = useSelector(selectCurrentAddress);

  const { setAdviser } = useAdviser();

  useEffect(() => {
    // setAdviser(loading ? 'loading...' : '', loading ? 'yellow' : 'red');
  }, [loading, setAdviser]);

  async function cyberlink() {
    if (!node || !queryClient || !address || !signingClient) {
      return;
    }

    try {
      setLoading(true);
      let fromCid = ask;
      if (!ask.match(PATTERN_IPFS_HASH)) {
        fromCid = await addContenToIpfs(node, ask);
      }

      let toCid = answer;
      if (!answer.match(PATTERN_IPFS_HASH)) {
        toCid = await addContenToIpfs(node, answer);
      }

      const result = await signingClient.cyberlink(address, fromCid, toCid, {
        amount: [],
        gas: DEFAULT_GAS_LIMITS.toString(),
      });

      if (result.code !== 0) {
        throw new Error(result.rawLog);
      }

      setTx({
        hash: result.transactionHash,
        onSuccess: () => {
          debugger;
          navigate(routes.ipfs.getLink(toCid));
        },
      });
    } catch (error) {
      console.error(error);
      setAdviser(error.message, 'red');
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainContainer width="100%">
      <div className={styles.info}>
        <h3 className={styles.titleText}>linking is fundamental to learning</h3>
        <p>
          learning can be squeezed into one simple act: creating a link when you
          link two{' '}
          <Link to={routes.search.getLink('pieces of information')}>
            pieces of information
          </Link>{' '}
          then{' '}
          <Link to={routes.search.getLink('search is trivial')}>
            search is trivial
          </Link>{' '}
          the more links you learned, the{' '}
          <Link to={routes.search.getLink('smarter you are')}>
            smarter you are
          </Link>
        </p>
      </div>

      <ul className={styles.list}>
        {[
          {
            title: 'upgrade',
            text: 'your intelligence to superintelligence',
          },
          {
            title: 'spread',
            text: 'your content cheaper',
          },
          {
            title: 'upload',
            text: <>your brain into eternity, and more</>,
          },
        ].map(({ title, text }) => {
          return (
            <li key={title}>
              <TitleText title={title} text={text} />
            </li>
          );
        })}
      </ul>

      <div className={styles.linksExample}>
        <h3 className={styles.titleText}>here is some cool links</h3>

        <ul>
          {[
            ['health', 'meditation'],
            ['music', 'joy'],
            ['cyber', 'freedom'],
            ['help', 'get H'],
            ['help', 'get energy'],
          ].map(([word1, word2], i) => {
            return (
              <li key={i}>
                <KeywordButton keyword={word1} />
                <span className={styles.tilde}>~</span>
                <KeywordButton keyword={word2} />
              </li>
            );
          })}
        </ul>
      </div>

      <section className={styles.learn}>
        <h3 className={styles.titleText}>now learn something new</h3>

        <div className={styles.inputs}>
          <Input
            color="pink"
            placeholder="Ask"
            value={ask}
            disabled={loading}
            onChange={(e) => setAsk(e.target.value)}
          />
          <span className={styles.tilde}>~</span>
          <Input
            color="pink"
            disabled={loading}
            value={answer}
            placeholder="Answer"
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      </section>

      <ActionBar>
        <Button
          disabled={!ask || !answer || !node || !queryClient}
          onClick={cyberlink}
        >
          cyberlink
        </Button>
      </ActionBar>
    </MainContainer>
  );
}

export default Learn;
