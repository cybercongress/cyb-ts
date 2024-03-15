import { useEffect, useState, useMemo } from 'react';
import { Pane } from '@cybercongress/gravity';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import BigNumber from 'bignumber.js';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { useQueryClient } from 'src/contexts/queryClient';
import { useAdviser } from 'src/features/adviser/context';
import Display from 'src/components/containerGradient/Display/Display';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { QueryParamsResponse as QueryParamsResponseResources } from '@cybercongress/cyber-js/build/codec/cyber/resources/v1beta1/query';
import { ItemBalance } from './ui';
import ERatio from './eRatio';
import { formatNumber, getDisplayAmount } from '../../utils/utils';
import { CYBER } from '../../utils/config';
import {
  Dots,
  CardStatisics,
  ValueImg,
  DenomArr,
  Tabs,
} from '../../components';
import useGetSlots from './useGetSlots';
import { TableSlots } from '../energy/ui';
import ActionBar from './actionBar';
import styles from './Mint.module.scss';
import { SLOTS_MAX, getAmountResource, getERatio, getMaxTimeMint } from './utils';
import { SelectedState } from './types';

const grid = {
  display: 'grid',
  gridTemplateColumns: '250px 1fr 250px',
  gridTemplateRows: 'auto',
  alignItems: 'center',
  margin: '64px 8px 0 8px',
  gridGap: '16px 16px',
  position: 'relative',
  paddingBottom: '150px',
};

const returnColorDot = (marks) => {
  return {
    style: {
      color: '#fff',
      whiteSpace: 'nowrap',
    },
    label: marks,
  };
};


function Mint() {
  const queryClient = useQueryClient();
  const { traseDenom } = useIbcDenom();
  const [updateAddress, setUpdateAddress] = useState(0);
  const [selected, setSelected] = useState<SelectedState>(
    SelectedState.milliampere
  );
  const [value, setValue] = useState(0);
  const [valueDays, setValueDays] = useState(1);
  const [height, setHeight] = useState(0);
  const [resourcesParams, setResourcesParams] =
    useState<QueryParamsResponseResources['params']>(undefined);
  const [balanceHydrogen, SetBalanceHydrogen] = useState(0);

  const addressActive = useAppSelector(selectCurrentAddress);
  const { slotsData, vested, loadingAuthAccounts, originalVesting, update } =
    useGetSlots(addressActive);

  const { setAdviser } = useAdviser();

  const liquidH =
    originalVesting[CYBER.DENOM_LIQUID_TOKEN] > 0
      ? new BigNumber(originalVesting[CYBER.DENOM_LIQUID_TOKEN])
          .minus(vested[CYBER.DENOM_LIQUID_TOKEN])
          .toNumber()
      : 0;

  const eRatio = getERatio(liquidH, balanceHydrogen);
  const max = new BigNumber(balanceHydrogen)
    .minus(liquidH)
    .dp(0, BigNumber.ROUND_FLOOR)
    .toNumber();

  const maxMintTime = getMaxTimeMint(resourcesParams, selected, height);
  const resourceToken = getAmountResource(resourcesParams, selected, height, {
    valueH: value,
    valueDays,
  });

  useEffect(() => {
    const availableSlots =
      SLOTS_MAX -
      slotsData.filter((slot) => slot.status === 'Unfreezing').length;

    setAdviser(
      <p>
        {slotsData.length === 0 ? (
          <>investmint - temporarily invest tokens to mint tokens</>
        ) : (
          <>you have {availableSlots} slots available for investmint</>
        )}
        <br />
        choose <ValueImg text="milliampere" /> or <ValueImg text="millivolt" />{' '}
        to mint, the amount of <ValueImg text="hydrogen" /> to invest, and the
        timeframe
      </p>
    );
  }, [setAdviser, slotsData]);

  useEffect(() => {
    if (!queryClient || !addressActive) {
      return;
    }

    queryClient
      .getBalance(addressActive, CYBER.DENOM_LIQUID_TOKEN)
      .then((response) => {
        SetBalanceHydrogen(parseFloat(response.amount));
      });
  }, [queryClient, addressActive, updateAddress]);

  useEffect(() => {
    if (!queryClient) {
      return;
    }

    queryClient
      .resourcesParams()
      .then((response: QueryParamsResponseResources) => {
        setResourcesParams(response.params);
      });

    queryClient.getHeight().then((response) => {
      setHeight(response);
    });
  }, [queryClient]);

  const updateFunc = () => {
    setValue(0);
    setValueDays(1);
    setUpdateAddress((item) => item + 1);
    update();
  };

  const vestedA = useMemo(() => {
    if (originalVesting.milliampere <= 0) {
      return 0;
    }

    const [{ coinDecimals }] = traseDenom(SelectedState.milliampere);
    const amount = new BigNumber(originalVesting.milliampere)
      .minus(vested.milliampere)
      .toNumber();

    return getDisplayAmount(amount, coinDecimals);
  }, [vested, originalVesting, traseDenom]);

  const vestedV = useMemo(() => {
    if (originalVesting.millivolt <= 0) {
      return 0;
    }

    const [{ coinDecimals }] = traseDenom(SelectedState.millivolt);
    const amount = new BigNumber(originalVesting.millivolt)
      .minus(vested.millivolt)
      .toNumber();
    return getDisplayAmount(amount, coinDecimals);
  }, [vested, originalVesting, traseDenom]);

  return (
    <>
      <main className="block-body">
        <Pane
          marginTop={10}
          marginBottom={50}
          display="grid"
          gridTemplateColumns="300px 300px 300px"
          gridGap="20px"
          justifyContent="center"
        >
          <CardStatisics
            title={<ValueImg text="milliampere" />}
            value={formatNumber(vestedA)}
          />
          <CardStatisics
            title={<ValueImg text="millivolt" />}
            value={formatNumber(vestedV)}
          />
          <CardStatisics
            title="My Energy"
            value={`${formatNumber(vestedA * vestedV)} W`}
          />
        </Pane>

        <div className={styles.tabs}>
          <Tabs
            options={['milliampere', 'millivolt'].map((item) => {
              return {
                text: <DenomArr denomValue={item} />,
                key: item,
                onClick: () => setSelected(item),
              };
            })}
            selected={selected}
          />
        </div>

        <div style={grid}>
          <div
            style={{
              display: 'grid',
              alignContent: 'space-evenly',
              height: '100%',
            }}
          >
            <ItemBalance
              text="Liquid"
              amount={max}
              currency={<ValueImg text={CYBER.DENOM_LIQUID_TOKEN} />}
            />
            <ItemBalance
              text="Frozen"
              amount={
                loadingAuthAccounts
                  ? null
                  : originalVesting[CYBER.DENOM_LIQUID_TOKEN] -
                    vested[CYBER.DENOM_LIQUID_TOKEN]
              }
              currency={<ValueImg text={CYBER.DENOM_LIQUID_TOKEN} />}
            />
          </div>
          <div
            style={{
              height: '100%',
              display: 'grid',
              gridTemplateRows: '1fr 1fr 1fr',
              width: '100%',
              justifyItems: 'center',
              padding: '0 10px',
            }}
          >
            <Pane fontSize="30px">{resourceToken}</Pane>
            <Slider
              value={value}
              min={0}
              max={max}
              marks={{
                [max]: returnColorDot(`${formatNumber(max)} H`),
              }}
              onChange={(eValue) => setValue(eValue)}
              trackStyle={{ backgroundColor: '#3ab793' }}
              railStyle={{ backgroundColor: '#97979775' }}
              dotStyle={{
                backgroundColor: '#97979775',
                borderColor: '#97979775',
              }}
              activeDotStyle={{
                borderColor: '#3ab793',
                backgroundColor: '#3ab793',
              }}
              handleStyle={{
                border: 'none',
                backgroundColor: '#3ab793',
              }}
            />

            <Slider
              value={valueDays}
              min={1}
              max={maxMintTime}
              marks={{
                1: returnColorDot('1 day'),
                [maxMintTime]: returnColorDot(`${maxMintTime} days`),
              }}
              onChange={(eValue) => setValueDays(eValue)}
              trackStyle={{ backgroundColor: '#3ab793' }}
              railStyle={{ backgroundColor: '#97979775' }}
              dotStyle={{
                backgroundColor: '#97979775',
                borderColor: '#97979775',
              }}
              activeDotStyle={{
                borderColor: '#3ab793',
                backgroundColor: '#3ab793',
              }}
              handleStyle={{
                border: 'none',
                backgroundColor: '#3ab793',
              }}
            />
          </div>
          <div>
            <ERatio eRatio={eRatio} />
          </div>
          {value > 0 && (
            <p className={styles.text}>
              You’re freezing <strong>{formatNumber(value)}</strong>{' '}
              <DenomArr denomValue="hydrogen" onlyImg /> for{' '}
              <strong>{valueDays} days</strong>. It will release{' '}
              <strong>{resourceToken}</strong>{' '}
              <DenomArr denomValue={selected} onlyImg /> for you. At the end of
              the period, {selected} becomes liquid automatically, but you can
              use it to boost ranking during the freeze. You can have only{' '}
              <strong>{SLOTS_MAX} slots</strong> for investmint at a time.
            </p>
          )}
        </div>

        {loadingAuthAccounts ? (
          <Dots big />
        ) : (
          <Display noPaddingX>
            <TableSlots data={slotsData} />
          </Display>
        )}
      </main>
      <ActionBar
        value={value}
        selected={selected}
        valueDays={valueDays}
        resourceToken={resourceToken}
        updateFnc={updateFunc}
        addressActive={addressActive}
      />
    </>
  );
}

export default Mint;
