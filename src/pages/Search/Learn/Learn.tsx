import { Link, useNavigate } from 'react-router-dom';
import {
  ActionBar,
  BandwidthBar,
  Button,
  Input,
  MainContainer,
} from 'src/components';
import { routes } from 'src/routes';
import { useEffect, useState } from 'react';
import { CYBER, PATTERN_IPFS_HASH } from 'src/utils/config';
import { addContenToIpfs } from 'src/services/ipfs/utils/utils-ipfs';
import { useIpfs } from 'src/contexts/ipfs';
import { useAdviser } from 'src/features/adviser/context';
import { useQueryClient } from 'src/contexts/queryClient';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useSigningClient } from 'src/contexts/signerClient';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import { Networks } from 'src/types/networks';
import useGetSlots from 'src/containers/mint/useGetSlots';
import { AdviserColors } from 'src/features/adviser/Adviser/Adviser';
import KeywordButton from '../KeywordButton/KeywordButton';
import styles from './Learn.module.scss';
import TitleText from '../TitleText/TitleText';

function Learn() {
  const [ask, setAsk] = useState('');
  const [answer, setAnswer] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { node } = useIpfs();
  const queryClient = useQueryClient();

  const address = useAppSelector(selectCurrentAddress);

  const { signer, signingClient } = useSigningClient();
  const navigate = useNavigate();

  const { balacesResource } = useGetSlots(address);

  const passport = useAppSelector(selectCurrentPassport);

  const noPassport = CYBER.CHAIN_ID === Networks.BOSTROM && !passport;

  const [tx, setTx] = useState({
    hash: '',
    onSuccess: () => {},
  });

  useWaitForTransaction({
    hash: tx.hash,
    onSuccess: tx.onSuccess,
  });

  const { setAdviser } = useAdviser();

  const noEnergy = !balacesResource.millivolt || !balacesResource.milliampere;

  useEffect(() => {
    let content;
    let adviserColor: keyof typeof AdviserColors = 'blue';

    if (error) {
      content = error;
      adviserColor = 'red';
    } else if (loading) {
      content = 'Transaction pending...';
      adviserColor = 'yellow';
    } else if (noPassport) {
      content = (
        <>
          moon <Link to={routes.portal.path}>citizenship</Link> unlocks all
          features and takes 3 minutes
        </>
      );
    } else if (noEnergy) {
      content = (
        <>
          to cyberlink and learn you need energy <br />
          amperes, 💡 and volts, ⚡️ can be produced by freezing hydrogen H in{' '}
          <Link to={routes.hfr.path}>HFR</Link>
        </>
      );
      adviserColor = 'red';
    } else {
      content = 'Create cyberlink';
    }

    setAdviser(content, adviserColor);
  }, [noPassport, noEnergy, loading, error, setAdviser]);

  useEffect(() => {
    setError(undefined);
  }, [ask, answer]);

  async function cyberlink() {
    if (!node || !queryClient || !address || !signer || !signingClient) {
      return;
    }

    const [{ address: signerAddress }] = await signer.getAccounts();

    if (signerAddress !== address) {
      setError('Signer address is not equal to current account');
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

      const result = await signingClient.cyberlink(
        address,
        fromCid,
        toCid,
        'auto'
      );

      if (result.code !== 0) {
        throw new Error(result.rawLog);
      }

      setTx({
        hash: result.transactionHash,
        onSuccess: () => {
          navigate(routes.ipfs.getLink(toCid));
        },
      });
    } catch (error) {
      // better use code of error
      if (error.message === 'Request rejected') {
        return;
      }

      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainContainer width="100%">
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <h3 className={styles.titleText}>
            linking is fundamental to learning
          </h3>
          <p>
            learning can be squeezed into one simple act: creating a link <br />
            when you link two{' '}
            <Link to={routes.search.getLink('particle')}>
              pieces of information
            </Link>{' '}
            then{' '}
            <Link to={routes.search.getLink('search is trivial')}>
              search is trivial
            </Link>
            <br />
            the more links you learned, the{' '}
            <Link to={routes.search.getLink('negentropy')}>
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
              text: (
                <>
                  your brain into eternity, <br /> and more
                </>
              ),
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
          <h3 className={styles.titleText}>here are some cool links</h3>

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
          <h3 className={styles.titleText}>now let's learn something new</h3>

          <div className={styles.inputs}>
            <Input
              value={ask}
              disabled={loading}
              placeholder="Ask"
              color="pink"
              onChange={(e) => setAsk(e.target.value)}
            />
            <span className={styles.tilde}>~</span>
            <Input
              value={answer}
              disabled={loading}
              placeholder="Answer"
              color="pink"
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
        </section>

        <div className={styles.energy}>
          <BandwidthBar />

          <div>
            <span>{balacesResource.millivolt} ⚡️</span>
            <span>{balacesResource.milliampere} 💡</span>
          </div>
        </div>

        <ActionBar>
          <Button
            disabled={!ask || !answer || !node || !queryClient}
            onClick={cyberlink}
          >
            {node ? 'cyberlink' : 'node is loading...'}
          </Button>
        </ActionBar>
      </div>
    </MainContainer>
  );
}

export default Learn;
