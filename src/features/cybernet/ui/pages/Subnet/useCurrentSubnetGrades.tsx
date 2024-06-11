import React, {
  useCallback,
  useEffect,
  useContext,
  useState,
  useMemo,
} from 'react';
import {
  formatGradeToWeight,
  formatWeightToGrade,
} from '../../utils/formatWeight';
import useExecuteCybernetContract from '../../useExecuteCybernetContract';
import { useAdviser } from 'src/features/adviser/context';
import { isEqual } from 'lodash';
import { useAppData } from '../../../../../contexts/appData';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import { useCurrentSubnet } from './subnet.context';
import useCybernetContract from '../../useQueryCybernetContract.refactor';
import { Weights } from '../../types';

export function getAverageGrade(grades, uid: number) {
  let count = 0;

  const sum = grades.reduce((acc, w) => {
    const grade = w[uid];

    if (grade === undefined) {
      return acc;
    }

    count++;

    return acc + grade;
  }, 0);

  const avg = sum ? (sum / count).toFixed(2) : 0;

  return Number(avg);
}

const LS_KEY = 'setGrades';
const LS_KEY2 = 'gradesUpdated';

function getLSKey(address: string) {
  return `${LS_KEY}_${address}`;
}

function getLSKe2(address: string) {
  return `${LS_KEY2}_${address}`;
}

function getLSData(address: string, subnetId: number) {
  const data = sessionStorage.getItem(getLSKey(address));

  const parsedData = data ? JSON.parse(data) : null;

  return parsedData ? parsedData[subnetId] : null;
}

function getLSData2(address: string, subnetId: number) {
  const data = localStorage.getItem(getLSKe2(address));

  const parsedData = data ? JSON.parse(data) : null;

  return parsedData ? parsedData[subnetId] : null;
}

function saveLSData2(block, address: string, subnetId: number) {
  const newData = {
    ...getLSData2(address, subnetId),
    [subnetId]: block,
  };

  localStorage.setItem(getLSKe2(address), JSON.stringify(newData));
}

function saveLSData(data, address: string, subnetId: number) {
  const newData = {
    ...getLSData(address, subnetId),
    [subnetId]: data,
  };

  sessionStorage.setItem(getLSKey(address), JSON.stringify(newData));
}

// const GradesContext = React.createContext<{
//   all: ReturnType<typeof useCybernetContract<Weights>>;
//   my: {
//     fromMe: {
//       [uid: string]: number;
//     } | null;
//     toMe: {
//       [uid: string]: number;
//     } | null;
//   };
//   newGrades: {
//     data: {
//       [uid: string]: number;
//     };
//     setGrade: (uid: string, grade: number) => void;
//     blocksLeftToSetGrades: number;
//   } | null;
// }>({
//   all: null,
//   my: null,
//   newGrades: {
//     data: null,
//     setGrade: null,
//   },
// });

type Props = {
  netuid: number;
  neuronsQuery: any;
  hyperparamsQuery: any;
};
/*
  @deprecated
*/
function useCurrentSubnetGrades({
  netuid,
  neuronsQuery,
  hyperparamsQuery,
}: Props) {
  const currentAddress = useCurrentAddress();

  const getLastGrades = useCallback(() => {
    if (!currentAddress || !netuid) {
      return null;
    }

    const lastGrades = getLSData(currentAddress, netuid);
    return lastGrades;
  }, [currentAddress, netuid]);

  const { block } = useAppData();

  const myUid = neuronsQuery.data?.find(
    (n) => n.hotkey === currentAddress
  )?.uid;

  const weightsQuery = useCybernetContract<Weights>({
    query: {
      get_weights_sparse: {
        netuid,
      },
    },
  });

  useEffect(() => {
    if (!currentAddress) {
      return;
    }

    const lastGrades = getLastGrades();

    if (lastGrades) {
      setNewGrades(lastGrades);
    }
  }, [currentAddress, netuid, getLastGrades]);

  const [newGrades, setNewGrades] = useState<{
    [uid: string]: number;
  }>({});

  const weightsRateLimit = hyperparamsQuery.data?.weights_rate_limit;

  const gradesSetBlockNumber = getLSData2(currentAddress, netuid);
  console.log(gradesSetBlockNumber);

  let blocksLeftToSetGrades = 0;
  if (gradesSetBlockNumber && weightsRateLimit && block) {
    const diff = block - gradesSetBlockNumber;
    const t = weightsRateLimit - diff;

    blocksLeftToSetGrades = t > 0 ? t : 0;
  }

  const grades = useMemo(() => {
    return weightsQuery.data?.map((w) => {
      if (!w.length) {
        return {};
      }

      return w.reduce<{
        [uid: string]: number;
      }>((acc, [uid, weight]) => {
        const grade = formatWeightToGrade(weight, 65535);

        acc[uid] = grade;

        return acc;
      }, {});
    });
  }, [weightsQuery.data]);

  const gradesFromMe = useMemo(() => {
    const lastGrades = getLastGrades();

    return lastGrades || grades?.[myUid] || {};
  }, [grades, myUid, getLastGrades]);

  useEffect(() => {
    setNewGrades(gradesFromMe);
  }, [gradesFromMe]);

  const setGrade = useCallback((uid: string, grade: number) => {
    setNewGrades((prev) => ({
      ...prev,
      [uid]: grade,
    }));
  }, []);

  useEffect(() => {
    if (!currentAddress || !netuid) {
      return;
    }

    if (Object.keys(newGrades).length === 0) {
      return;
    }

    const lastData = getLSData(currentAddress, netuid);

    if (isEqual(newGrades, lastData)) {
      return;
    }

    saveLSData(newGrades, currentAddress, netuid);
  }, [newGrades, currentAddress, netuid]);

  const { setAdviser } = useAdviser();

  const { mutate: submit, isLoading } = useExecuteCybernetContract({
    query: {
      set_weights: {
        dests:
          // data?.length &&
          // new Array(data?.length - 1).fill(0).map((_, i) => i + 1),
          Object.keys(newGrades)
            .sort((a, b) => +a - +b)
            .map((uid) => +uid),
        netuid,
        weights: Object.values(newGrades).map((grade) => {
          const weight = formatGradeToWeight(grade, 65535);
          return weight;
        }),
        version_key: 0,
      },
    },
    onSuccess: () => {
      setAdviser('Weights set', 'green');
      weightsQuery.refetch();
      saveLSData2(block, currentAddress, netuid);
    },
  });

  const value = useMemo(() => {
    return {
      all: {
        ...weightsQuery,
        data: grades,
      },
      my: {
        fromMe: gradesFromMe,
        toMe: null,
      },
      refetch: weightsQuery.refetch,
      newGrades: {
        data: newGrades,
        setGrade,
        save: submit,
        isLoading,
        blocksLeftToSetGrades,
        isGradesUpdated: !isEqual(newGrades, gradesFromMe),
      },
    };
  }, [
    weightsQuery,
    grades,
    gradesFromMe,
    newGrades,
    setGrade,
    submit,
    isLoading,
    blocksLeftToSetGrades,
  ]);

  return value;
}

export default useCurrentSubnetGrades;
