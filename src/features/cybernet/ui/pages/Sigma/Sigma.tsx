import { Account, AmountDenom, MainContainer } from 'src/components';
import Sigma from '../../../../../containers/sigma/index';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import Display from 'src/components/containerGradient/Display/Display';
import { cybernetRoutes } from '../../routes';
import { useStake } from '../../hooks/useCurrentAccountStake';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { trimString } from 'src/utils/utils';
import styles from './Sigma.module.scss';
import Loader2 from 'src/components/ui/Loader2';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { routes } from 'src/routes';
import { useCybernet } from '../../cybernet.context';
import { AccountInput } from 'src/pages/teleport/components/Inputs';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';

// reuse
const contractsConfig = [
  'pussy1j9qku20ssfjdzgl3y5hl0vfxzsjwzwn7d7us2t2n4ejgc6pesqcqhnxsz0',
  'pussy1guj27rm0uj2mhwnnsr8j7cz6uvsz2d759kpalgqs60jahfzwgjcs4l28cw',
];

const legacy = [
  'pussy155k695hqnzl05lx79kg9754k8cguw7wled38u2qacpxl62mrkfasy3k6x5',
  'pussy1xemzpkq2qd6a5e08xxy5ffcwx9r4xn5fqe6v02rkte883f9xhg5q29ye9y',
];

function Item({ contractAddress, callback, address }) {
  const query = useStake({
    address,
    contractAddress,
  });

  const filteredData = query.data?.filter(({ stake }) => stake > 0);

  const total = useMemo(() => {
    return filteredData?.reduce((acc, { stake }) => acc + stake, 0) || 0;
  }, [filteredData]);

  useEffect(() => {
    callback(total, contractAddress);
  }, [total, callback, contractAddress]);

  const isLegacy = legacy.includes(contractAddress);

  const { contracts } = useCybernet();

  const contractName = contracts.find(
    (contract) => contract.address === contractAddress
  )?.metadata?.name;

  return (
    <Display
      title={
        <DisplayTitle
          title={
            <Link
              to={
                !isLegacy
                  ? cybernetRoutes.verse.getLink('pussy', contractAddress)
                  : routes.contracts.byAddress.getLink(contractAddress)
              }
            >
              {contractName || trimString(contractAddress, 6, 6)}
            </Link>
          }
        >
          <IconsNumber value={total} type="pussy" />
        </DisplayTitle>
      }
    >
      {query.loading ? (
        <Loader2 />
      ) : query.error ? (
        query.error.message
      ) : filteredData?.length > 0 ? (
        filteredData
          .sort((a, b) => b.stake - a.stake)
          .map(({ hotkey, stake }) => {
            return (
              <div key={hotkey} className={styles.item}>
                <Account
                  address={hotkey}
                  avatar
                  markCurrentAddress
                  link={cybernetRoutes.delegator.getLink(
                    'pussy',
                    contractAddress,
                    hotkey
                  )}
                />

                <div>
                  <IconsNumber value={stake} type="pussy" />
                </div>
              </div>
            );
          })
      ) : (
        'No stakes'
      )}
    </Display>
  );
}

function Sigma() {
  useAdviserTexts({
    defaultText: 'learners stake stat',
  });

  const [total, setTotal] = useState<{
    [key: string]: number;
  }>({});

  const currentAddress = useCurrentAddress();
  const [address, setAddress] = useState(currentAddress);

  useEffect(() => {
    if (!address && currentAddress) {
      setAddress(currentAddress);
    }
  }, [currentAddress, address]);

  const sum = Object.values(total).reduce((acc, value) => acc + value, 0);

  const handleTotal = useCallback((value: number, contractAddress: string) => {
    setTotal((prev) => ({
      ...prev,
      [contractAddress]: value,
    }));
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <Display
          title={
            <DisplayTitle
              title={
                <>
                  Sigma
                  <div className={styles.chooser}>
                    <AccountInput
                      recipient={address}
                      setRecipient={setAddress}
                      title="choose learner"
                    />
                  </div>
                </>
              }
            >
              <AmountDenom amountValue={sum} denom="pussy" />
            </DisplayTitle>
          }
        >
          {' '}
        </Display>
      </div>

      {contractsConfig.map((contractAddress) => (
        <Item
          address={address}
          key={contractAddress}
          contractAddress={contractAddress}
          callback={handleTotal}
        />
      ))}

      <h3>legacy verses</h3>

      {legacy.map((contractAddress) => (
        <Item
          address={address}
          key={contractAddress}
          contractAddress={contractAddress}
          callback={handleTotal}
        />
      ))}
    </>
  );
}

export default Sigma;
