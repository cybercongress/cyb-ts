/* eslint-disable no-nested-ternary */
import BigNumber from 'bignumber.js';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  formatCurrency,
  formatNumber,
  timeSince,
} from '../../../../utils/utils';
import {
  useAccountCount,
  useGetPortalStats,
  useGetNegentropy,
  useGetValidatorsBonded,
  useGetGraphStats,
} from '../../hooks';
import slideData from './slideData';

const PREFIXES = [
  {
    prefix: 'T',
    power: 1024 * 10 ** 9,
  },
  {
    prefix: 'G',
    power: 1024 * 10 ** 6,
  },
  {
    prefix: 'M',
    power: 1024 * 10 ** 3,
  },
  {
    prefix: 'K',
    power: 1024,
  },
];

const delay = 4000;

function PlayTitle() {
  const dataAccountCount = useAccountCount();
  const dataGetPortalStats = useGetPortalStats();
  const dataGetNegentropy = useGetNegentropy();
  const dataGetValidatorsBonded = useGetValidatorsBonded();
  const dataGetGraphStats = useGetGraphStats();
  const timeoutRef = useRef(null);
  const [slideDataState, setSlideDataState] = useState({ ...slideData });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dataGetNegentropy.status === 'success' && dataGetNegentropy.data) {
      slideDataState.realDistributed = {
        ...slideDataState.realDistributed,
        amount: formatNumber(dataGetNegentropy.data.negentropy),
        change: {
          time: dataGetNegentropy.changeTimeAmount.time,
          amount: formatNumber(dataGetNegentropy.changeTimeAmount.amount),
        },
      };
    }
  }, [dataGetNegentropy]);

  useEffect(() => {
    if (dataAccountCount.status === 'success' && dataAccountCount.data) {
      slideDataState.everGrowing = {
        ...slideDataState.everGrowing,
        amount: formatNumber(dataAccountCount.data.accountCount),
        change: {
          time: dataAccountCount.changeTimeAmount.time,
          amount: formatNumber(dataAccountCount.changeTimeAmount.amount),
        },
      };
    }
  }, [dataAccountCount]);

  useEffect(() => {
    if (dataGetPortalStats.status === 'success' && dataGetPortalStats.data) {
      slideDataState.superintelligentMoon = {
        ...slideDataState.superintelligentMoon,
        amount: formatNumber(dataGetPortalStats.data.citizens),
        change: {
          time: dataGetPortalStats.changeTimeAmount.time,
          amount: formatNumber(
            dataGetPortalStats.changeTimeAmount.citizensAmount
          ),
        },
      };

      slideDataState.provable = {
        ...slideDataState.provable,
        amount: `${formatNumber(dataGetPortalStats.data.procentClaim)} %`,
        change: {
          time: dataGetPortalStats.changeTimeAmount.time,
          amount: `${formatNumber(
            dataGetPortalStats.changeTimeAmount.procentClaimAmount
          )} %`,
        },
      };
    }
  }, [dataGetPortalStats]);

  useEffect(() => {
    if (
      dataGetValidatorsBonded.status === 'success' &&
      dataGetValidatorsBonded.data
    ) {
      slideDataState.biggestUseful = {
        ...slideDataState.biggestUseful,
        amount: formatNumber(dataGetValidatorsBonded.data.validators),
        change: {
          time: dataGetValidatorsBonded.changeTimeAmount.time,
          amount: formatNumber(dataGetValidatorsBonded.changeTimeAmount.amount),
        },
      };
    }
  }, [dataGetValidatorsBonded]);

  useEffect(() => {
    if (dataGetGraphStats.status === 'success' && dataGetGraphStats.data) {
      const { cyberlinks, particles, beta, bits } = dataGetGraphStats.data;
      const { changeTimeAmount } = dataGetGraphStats;

      slideDataState.collaborativeNeural = {
        ...slideDataState.collaborativeNeural,
        amount: formatNumber(cyberlinks),
        change: {
          amount: formatNumber(changeTimeAmount.cyberlinks),
          time: changeTimeAmount.time,
        },
      };
      slideDataState.nextGen = {
        ...slideDataState.nextGen,
        amount: formatNumber(particles),
        change: {
          amount: formatNumber(changeTimeAmount.particles),
          time: changeTimeAmount.time,
        },
      };
      slideDataState.permissionlessOnchain = {
        ...slideDataState.permissionlessOnchain,
        amount: formatNumber(beta),
        change: {
          amount: formatNumber(changeTimeAmount.beta),
          time: changeTimeAmount.time,
        },
      };
      slideDataState.unstoppablePublic = {
        ...slideDataState.unstoppablePublic,
        amount: formatCurrency(bits, 'B', 0, PREFIXES),
        change: {
          amount: formatCurrency(changeTimeAmount.bits, 'B', 0, PREFIXES),
          time: changeTimeAmount.time,
        },
      };
    }
  }, [dataGetGraphStats]);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    if (index === Object.values(slideData).length - 1) {
      resetTimeout();
    } else {
      timeoutRef.current = setTimeout(
        () =>
          setIndex((prevIndex) =>
            prevIndex === Object.values(slideData).length - 1
              ? Object.values(slideData).length - 1
              : prevIndex + 1
          ),
        delay
      );
    }

    return () => {
      resetTimeout();
    };
  }, [index, slideData]);

  const restartSlide = useCallback(() => {
    if (index === Object.values(slideData).length - 1) {
      resetTimeout();
      setIndex(0);
    }
  }, [index, slideData]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
      onClick={() => restartSlide()}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ color: '#FFD900', fontSize: 20 }}>
          {Object.values(slideDataState)[index].amount}
        </div>
        <div style={{ color: '#777777', fontSize: 14 }}>
          {Object.values(slideDataState)[index].keyAmount}
        </div>
      </div>
      <div>{Object.values(slideDataState)[index].title}</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            color:
              parseFloat(Object.values(slideDataState)[index].change.amount) >=
              0
                ? '#76FF03'
                : 'FF0000',
            fontSize: 20,
          }}
        >
          {parseFloat(Object.values(slideDataState)[index].change.amount) !== 0
            ? parseFloat(Object.values(slideDataState)[index].change.amount) > 0
              ? '+'
              : '-'
            : ''}
          {Object.values(slideDataState)[index].change.amount}
        </div>
        <div style={{ color: '#777777', fontSize: 14 }}>
          {timeSince(Object.values(slideDataState)[index].change.time)} ago
        </div>
      </div>
    </div>
  );
}

export default PlayTitle;
