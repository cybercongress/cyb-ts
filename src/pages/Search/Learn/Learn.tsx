import { Link, useNavigate } from 'react-router-dom';
import {
  ActionBar,
  BandwidthBar,
  Button,
  Input,
  MainContainer,
} from 'src/components';
import { routes } from 'src/routes';
import TitleText from '../TitleText/TitleText';
import styles from './Learn.module.scss';
import KeywordButton from '../KeywordButton/KeywordButton';
import { useEffect, useState } from 'react';
import { CYBER, DEFAULT_GAS_LIMITS, PATTERN_IPFS_HASH } from 'src/utils/config';
import { addContenToIpfs } from 'src/utils/ipfs/utils-ipfs';
import { useIpfs } from 'src/contexts/ipfs';
import { useAdviser } from 'src/features/adviser/context';
import Loading from '../../../components/ui/Loading';
import { useQueryClient } from 'src/contexts/queryClient';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useSelector } from 'react-redux';
import { useSigningClient } from 'src/contexts/signerClient';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import { Networks } from 'src/types/networks';
import { routes } from '../../../routes';
import useGetSlots from 'src/containers/mint/useGetSlots';
import { AdviserColors } from 'src/features/adviser/Adviser/Adviser';

function Learn() {
  const [ask, setAsk] = useState('');
  const [answer, setAnswer] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { node } = useIpfs();
  const queryClient = useQueryClient();

  const address = useSelector(selectCurrentAddress);

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
          to cyberlink and learn you need energy. Energy, amperes A and volts V
          can be produced by freezing hydrogen H in{' '}
          <Link to={routes.hfr.path}>HFR</Link>
        </>
      );
      adviserColor = 'red';
    } else {
      content = 'create cyberlink';
    }

    setAdviser(content, adviserColor);
  }, [noPassport, noEnergy, loading, error, setAdviser]);

  useEffect(() => {
    setError(undefined);
  }, [ask, answer]);

  async function cyberlink() {
    if (!node || !queryClient || !address || !signingClient) {
      return;
    }

    // TODO: check address === wallet

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
            learning can be squeezed into one simple act: creating a link when
            you link two{' '}
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
            cyberlink
          </Button>
        </ActionBar>
      </div>
    </MainContainer>
  );
}

export default Learn;
