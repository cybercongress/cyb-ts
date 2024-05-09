import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDevice } from 'src/contexts/device';
import { useQueryClient } from 'src/contexts/queryClient';
import { useAdviser } from 'src/features/adviser/context';
import { getDelegatorDelegations } from 'src/utils/search/utils';
import { BondStatus } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { DenomArr } from 'src/components';
import { fromBech32, formatNumber, asyncForEach } from '../../utils/utils';
import { Loading } from '../../components';
import ActionBarContainer from './ActionBarContainer';
import { TableHeroes, TableItem, InfoBalance } from './components';
import getHeroes from './getHeroesHook';
import { useGetBalance } from '../../pages/robot/_refactor/account/hooks';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import styles from './Validators.module.scss';

function Validators({ defaultAccount }) {
  const { isMobile: mobile } = useDevice();
  const { status = 'active' } = useParams();

  const queryClient = useQueryClient();
  const [updatePage, setUpdatePage] = useState(0);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { balance, loadingBalanceInfo, balanceToken } = useGetBalance(
    addressActive,
    updatePage
  );
  const { validators, loadingValidators } = getHeroes();
  const [loadingSelf, setLoadingSelf] = useState(true);
  const [loadingBond, setLoadingBond] = useState(true);
  const [bondedTokens, setBondedTokens] = useState(0);
  const [validatorSelect, setValidatorSelect] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState('');
  const [unStake, setUnStake] = useState(false);
  const [delegationsData, setDelegationsData] = useState([]);
  const [validatorsData, setValidatorsData] = useState([]);
  // FIXME: use useGetHeroes hook instead

  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <div className={styles.info}>
        the current undelegation period is <strong>42 days</strong>
        <br />
        you need to burn 1 <DenomArr denomValue="hydrogen" onlyImg /> to unstake
        1 <DenomArr denomValue="boot" onlyImg />
      </div>
    );
  }, [setAdviser]);

  useEffect(() => {
    setValidatorsData(validators);
    setSelectedIndex('');
  }, [validators]);

  const updateFnc = () => {
    setUpdatePage((item) => item + 1);
    setValidatorSelect([]);
  };

  useEffect(() => {
    if (addressActive !== null) {
      setLoadingBond(true);
      setLoadingSelf(true);
    }
  }, [addressActive]);

  useEffect(() => {
    const feachPool = async () => {
      if (queryClient) {
        const response = await queryClient.stakingPool();
        if (response.pool.bondedTokens) {
          setBondedTokens(response.pool.bondedTokens);
        }
      }
    };
    feachPool();
  }, [queryClient]);

  useEffect(() => {
    try {
      const feachDelegatorDelegations = async () => {
        let delegationsDataTemp = [];
        if (addressActive !== null && queryClient) {
          const responseDelegatorDelegations = await getDelegatorDelegations(
            queryClient,
            addressActive.bech32
          );
          delegationsDataTemp = responseDelegatorDelegations;
        }
        setDelegationsData(delegationsDataTemp);
      };
      feachDelegatorDelegations();
    } catch (e) {
      console.log(`e`, e);
      setDelegationsData([]);
    }
  }, [addressActive, queryClient, updatePage]);

  useEffect(() => {
    if (validators.length > 0 && delegationsData.length > 0) {
      const tempValidators = [...validators];
      const tempDelegationsData = [...delegationsData];

      tempDelegationsData.forEach((item) => {
        tempValidators.forEach((itemValidators, j) => {
          if (
            itemValidators.operatorAddress === item.delegation.validatorAddress
          ) {
            tempValidators[j].delegation = item.balance;
          }
        });
      });
      setValidatorsData(tempValidators);
      setLoadingBond(false);
    } else {
      setLoadingBond(true);
    }
  }, [delegationsData, validators]);

  useEffect(() => {
    const selfDelegation = async () => {
      if (queryClient && validatorsData.length > 0) {
        await asyncForEach(
          Array.from(Array(validatorsData.length).keys()),
          async (item) => {
            const delegatorAddress = fromBech32(
              validatorsData[item].operatorAddress
            );
            let shares = 0;
            try {
              const getSelfDelegation = await queryClient.delegation(
                delegatorAddress,
                validatorsData[item].operatorAddress
              );
              const { delegationResponse } = getSelfDelegation;
              if (
                delegationResponse.balance.amount &&
                validatorsData[item].delegatorShares > 0
              ) {
                const selfShares = delegationResponse.balance.amount;
                const delegatorShares =
                  validatorsData[item].delegatorShares * 10 ** -18;
                shares = (selfShares / delegatorShares) * 100;
              }
            } catch (error) {
              shares = 0;
            }
            validatorsData[item].shares = formatNumber(
              Math.floor(shares * 100) / 100,
              2
            );
          }
        );
        setLoadingSelf(false);
      }
    };
    selfDelegation();
  }, [validatorsData, queryClient]);

  const selectValidators = (validator, index) => {
    let selectValidator = {};
    let stake = false;

    if (selectedIndex === index) {
      setSelectedIndex('');
    } else {
      setSelectedIndex(index);
    }
    if (validatorSelect !== validator) {
      selectValidator = validator;
      if (selectValidator.delegation) {
        if (parseFloat(selectValidator.delegation.amount) > 0) {
          stake = true;
        }
      }
    }
    setValidatorSelect(selectValidator);
    setUnStake(stake);
  };

  if (loadingValidators) {
    return (
      <div
        style={{
          width: '100%',
          height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Loading />
        <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
          Loading
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="block-body" style={{ paddingTop: 0 }}>
        <InfoBalance
          balance={balance}
          loadingBalanceInfo={loadingBalanceInfo}
          balanceToken={balanceToken}
        />
        <TableHeroes mobile={mobile} showJailed={status === 'jailed'}>
          {validatorsData
            .filter((validator) =>
              status === 'jailed'
                ? BondStatus[validator.status] < 3
                : BondStatus[validator.status] === 3
            )
            .map((validator, index) => {
              const commission = formatNumber(
                validator.commission.commissionRates.rate * 10 ** -18 * 100,
                2
              );
              const staking = formatNumber(
                Math.floor((validator.tokens / bondedTokens) * 100 * 100) / 100,
                2
              );
              return (
                <TableItem
                  key={validator.operator_address}
                  staking={staking}
                  commission={commission}
                  item={validator}
                  index={index + 1}
                  selected={index === selectedIndex}
                  selectValidators={() => selectValidators(validator, index)}
                  mobile={mobile}
                  showJailed={status === 'jailed'}
                  loadingSelf={loadingSelf}
                  loadingBond={loadingBond}
                />
              );
            })}
        </TableHeroes>
      </main>
      <ActionBarContainer
        updateFnc={updateFnc}
        validators={validatorSelect}
        addressPocket={addressActive}
        unStake={unStake}
        mobile={mobile}
        balance={balance}
        loadingBalanceInfo={loadingBalanceInfo}
        balanceToken={balanceToken}
      />
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Validators);
