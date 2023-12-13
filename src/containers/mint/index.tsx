import { useEffect, useState, useMemo } from 'react';
import { Tablist, Pane } from '@cybercongress/gravity';
import Slider from 'rc-slider';
import BigNumber from 'bignumber.js';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { useQueryClient } from 'src/contexts/queryClient';
import { Btn, ItemBalance } from './ui';
import 'rc-slider/assets/index.css';
import { formatNumber, getDisplayAmount } from '../../utils/utils';
import { CYBER } from '../../utils/config';
import ERatio from './eRatio';
import { Dots, CardStatisics, ValueImg, DenomArr } from '../../components';
import useGetSlots from './useGetSlots';
import { TableSlots } from '../energy/ui';
import ActionBar from './actionBar';
import { useAdviser } from 'src/features/adviser/context';
import Display from 'src/components/containerGradient/Display/Display';
import ImgDenom from 'src/components/valueImg/imgDenom';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import styles from './Mint.module.scss';

const BASE_VESTING_TIME = 86401;
const BASE_MAX_MINT_TIME = 41;

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

const SLOTS_MAX = 16;

enum SelectedState {
  millivolt = 'millivolt',
  milliampere = 'milliampere',
}

function Mint() {
  const queryClient = useQueryClient();
  const { traseDenom } = useIbcDenom();
  const [updateAddress, setUpdateAddress] = useState(0);
  // const { balance } = useGetBalance(addressActive, updateAddress);
  const [selected, setSelected] = useState<SelectedState>(
    SelectedState.milliampere
  );
  const [value, setValue] = useState(0);
  const [valueDays, setValueDays] = useState(1);
  const [max, setMax] = useState(0);
  const [maxMintTime, setMaxMintTime] = useState(BASE_MAX_MINT_TIME);
  const [eRatio, setERatio] = useState(0);
  const [resourceToken, setResourceToken] = useState(0);
  const [height, setHeight] = useState(0);
  const [resourcesParams, setResourcesParams] = useState(null);
  const [balanceHydrogen, SetBalanceHydrogen] = useState(0);

  const addressActive = useAppSelector(selectCurrentAddress);
  const { slotsData, vested, loadingAuthAccounts, originalVesting } =
    useGetSlots(addressActive, updateAddress);

  const { setAdviser } = useAdviser();

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
    const getBalanceH = async () => {
      let amountHydrogen = 0;
      if (queryClient && addressActive !== null) {
        const responseBalance = await queryClient.getBalance(
          addressActive,
          CYBER.DENOM_LIQUID_TOKEN
        );
        if (responseBalance.amount) {
          amountHydrogen = parseFloat(responseBalance.amount);
        }
      }
      SetBalanceHydrogen(amountHydrogen);
    };
    getBalanceH();
  }, [queryClient, addressActive]);

  useEffect(() => {
    const getParam = async () => {
      const responseResourcesParams = await queryClient.resourcesParams();
      if (
        responseResourcesParams.params &&
        Object.keys(responseResourcesParams.params).length > 0
      ) {
        const { params } = responseResourcesParams;
        setResourcesParams((item) => ({ ...item, ...params }));
      }

      const responseGetHeight = await queryClient.getHeight();
      if (responseGetHeight > 0) {
        setHeight(responseGetHeight);
      }
    };
    getParam();
  }, [queryClient]);

  useEffect(() => {
    let vestedTokens = 0;
    let maxValue = 0;
    if (originalVesting[CYBER.DENOM_LIQUID_TOKEN] > 0) {
      vestedTokens =
        parseFloat(originalVesting[CYBER.DENOM_LIQUID_TOKEN]) -
        parseFloat(vested[CYBER.DENOM_LIQUID_TOKEN]);
    }
    if (balanceHydrogen > 0) {
      maxValue = Math.floor(balanceHydrogen) - vestedTokens;
    } else {
      maxValue = 0;
    }

    setMax(maxValue);
  }, [balanceHydrogen, vested, originalVesting]);

  useEffect(() => {
    let vestedTokens = 0;
    if (originalVesting[CYBER.DENOM_LIQUID_TOKEN] > 0) {
      vestedTokens =
        parseFloat(originalVesting[CYBER.DENOM_LIQUID_TOKEN]) -
        parseFloat(vested[CYBER.DENOM_LIQUID_TOKEN]);
    }
    if (vestedTokens > 0 && balanceHydrogen > 0) {
      const procent = (vestedTokens / balanceHydrogen) * 100;
      const eRatioTemp = Math.floor(procent * 100) / 100;
      setERatio(eRatioTemp);
    } else {
      setERatio(0);
    }
  }, [balanceHydrogen, vested, originalVesting]);

  useEffect(() => {
    let maxValueTaime = BASE_MAX_MINT_TIME;
    if (resourcesParams !== null) {
      const {
        halvingPeriodAmpereBlocks: halvingPeriodBlocksAmpere,
        halvingPeriodVoltBlocks: halvingPeriodBlocksVolt,
      } = resourcesParams;
      let halvingPeriod = 0;
      if (selected === 'millivolt') {
        halvingPeriod = halvingPeriodBlocksVolt;
      } else {
        halvingPeriod = halvingPeriodBlocksAmpere;
      }

      const halving = 2 ** Math.floor(height / halvingPeriod);
      maxValueTaime = Math.floor(
        (halvingPeriod * 5 * halving) / BASE_VESTING_TIME
      );
    }
    setMaxMintTime(maxValueTaime);
  }, [resourcesParams, height, selected]);

  useEffect(() => {
    let token = 0;
    if (resourcesParams !== null && value > 0 && valueDays > 0) {
      const hydrogen = value;
      const {
        baseInvestmintAmountVolt,
        baseInvestmintAmountAmpere,
        baseInvestmintPeriodVolt,
        baseInvestmintPeriodAmpere,
        halvingPeriodAmpereBlocks: halvingPeriodBlocksAmpere,
        halvingPeriodVoltBlocks: halvingPeriodBlocksVolt,
      } = resourcesParams;
      let baseLength = 0;
      let baseAmount = 0;
      let halvingPeriod = 0;
      if (selected === 'millivolt') {
        baseLength = baseInvestmintPeriodVolt;
        baseAmount = parseFloat(baseInvestmintAmountVolt.amount);
        halvingPeriod = halvingPeriodBlocksVolt;
      } else {
        baseLength = baseInvestmintPeriodAmpere;
        baseAmount = parseFloat(baseInvestmintAmountAmpere.amount);
        halvingPeriod = halvingPeriodBlocksAmpere;
      }
      const vestingTime = valueDays * BASE_VESTING_TIME;
      const cycles = vestingTime / baseLength;
      const base = hydrogen / baseAmount;
      const halving = 0.5 ** Math.floor(height / halvingPeriod);

      token = Math.floor(cycles * base * halving);
    }
    setResourceToken(token);
  }, [value, valueDays, selected, resourcesParams, height]);

  const updateFunc = () => {
    setValue(0);
    setValueDays(1);
    setUpdateAddress(updateAddress + 1);
  };

  const vestedA = useMemo(() => {
    let amountA = 0;
    if (originalVesting.milliampere > 0) {
      const [{ coinDecimals }] = traseDenom('milliampere');
      const vestedTokensA = new BigNumber(originalVesting.milliampere)
        .minus(vested.milliampere)
        .toNumber();
      amountA = getDisplayAmount(vestedTokensA, coinDecimals);
    }
    return amountA;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vested, originalVesting]);

  const vestedV = useMemo(() => {
    let amountV = 0;
    if (originalVesting.millivolt > 0) {
      const [{ coinDecimals }] = traseDenom('millivolt');
      const vestedTokensA = new BigNumber(originalVesting.millivolt)
        .minus(vested.millivolt)
        .toNumber();
      amountV = getDisplayAmount(vestedTokensA, coinDecimals);
    }
    return amountV;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vested, originalVesting]);

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
            title={<ValueImg text="millivolt" />}
            value={formatNumber(vestedV)}
          />
          <CardStatisics
            title={<ValueImg text="milliampere" />}
            value={formatNumber(vestedA)}
          />
          <CardStatisics
            title="My Energy"
            value={`${formatNumber(vestedA * vestedV)} W`}
          />
        </Pane>
        <Tablist
          display="grid"
          gridTemplateColumns="150px 150px"
          gridGap="8px"
          justifyContent="center"
        >
          <Btn
            text={<ValueImg justifyContent="center" text="milliampere" />}
            checkedSwitch={selected === 'milliampere'}
            onSelect={() => setSelected('milliampere')}
          />
          <Btn
            text={<ValueImg justifyContent="center" text="millivolt" />}
            checkedSwitch={selected === 'millivolt'}
            onSelect={() => setSelected('millivolt')}
          />
        </Tablist>
        <div style={grid}>
          <div
            style={{
              display: 'grid',
              alignContent: 'space-evenly',
              height: '100%',
            }}
          >
            {/* <ItemBalance text="Liquid balance" amount={balance.available} /> */}
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
          <Display>
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
