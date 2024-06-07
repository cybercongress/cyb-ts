import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import {
  SubnetInfo,
  SubnetNeuron,
  Weights,
  Weigths,
} from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import {
  formatGradeToWeight,
  formatWeightToGrade,
} from '../../utils/formatWeight';
import useExecuteCybernetContract from '../../useExecuteCybernetContract';
import { useAdviser } from 'src/features/adviser/context';
import { isEqual } from 'lodash';

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

// split grades to new hook

const LS_KEY = 'setGrades';

function getLSKey(address: string) {
  return `${LS_KEY}_${address}`;
}

function getLSData(address: string, subnetId: number) {
  const data = sessionStorage.getItem(getLSKey(address));

  const parsedData = data ? JSON.parse(data) : null;

  return parsedData ? parsedData[subnetId] : null;
}

function saveLSData(data, address: string, subnetId: number) {
  const newData = {
    ...getLSData(address, subnetId),
    [subnetId]: data,
  };

  sessionStorage.setItem(getLSKey(address), JSON.stringify(newData));
}

const SubnetContext = React.createContext<{
  subnetQuery: ReturnType<typeof useCybernetContract<SubnetInfo>>;
  neuronsQuery: {
    data: SubnetNeuron[];
    // refetch: () => void;
  } | null;
  addressRegisteredInSubnet: boolean;
  grades: {
    all: ReturnType<typeof useCybernetContract<Weights>>;
    my: {
      fromMe: {
        [uid: string]: number;
      } | null;
      toMe: {
        [uid: string]: number;
      } | null;
    };
    newGrades: {
      data: {
        [uid: string]: number;
      };
      setGrade: (uid: string, grade: number) => void;
    } | null;
  };
}>({
  subnetQuery: null,
  neuronsQuery: null,
  grades: {
    all: null,
    my: null,
    newGrades: {
      data: null,
      setGrade: null,
    },
  },
});

export function useSubnet() {
  return React.useContext(SubnetContext);
}

function SubnetProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();

  const f = id === 'board' ? 0 : +id;
  const netuid = Number(f);

  const currentAddress = useCurrentAddress();

  const getLastGrades = useCallback(() => {
    if (!currentAddress || !netuid) {
      return null;
    }

    const lastGrades = getLSData(currentAddress, netuid);
    return lastGrades;
  }, [currentAddress, netuid]);

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

  const { data: addressSubnetRegistrationStatus, refetch } =
    useCybernetContract<number | null>({
      query: {
        get_uid_for_hotkey_on_subnet: {
          netuid,
          hotkey: currentAddress,
        },
      },
    });

  const addressRegisteredInSubnet = addressSubnetRegistrationStatus !== null;

  const subnetQuery = useCybernetContract<SubnetInfo>({
    query: {
      get_subnet_info: {
        netuid,
      },
    },
  });

  const neuronsQuery = useCybernetContract<SubnetNeuron[]>({
    query: {
      get_neurons: {
        netuid,
      },
    },
  });

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
    },
  });

  const value = useMemo(() => {
    return {
      addressRegisteredInSubnet,
      subnetQuery,
      neuronsQuery,
      grades: {
        all: {
          ...weightsQuery,
          data: grades,
        },
        my: {
          fromMe: gradesFromMe,
          toMe: null,
        },
        newGrades: {
          data: newGrades,
          setGrade,
          save: submit,
          isLoading,
          isGradesUpdated: !isEqual(newGrades, gradesFromMe),
        },
      },
      refetch: () => {
        subnetQuery.refetch();
        neuronsQuery.refetch();
        weightsQuery.refetch();
        refetch();
      },
    };
  }, [
    addressRegisteredInSubnet,
    subnetQuery,
    setGrade,
    refetch,
    neuronsQuery,
    weightsQuery,
    grades,
    isLoading,
    gradesFromMe,
    newGrades,
    submit,
  ]);

  return (
    <SubnetContext.Provider value={value}>{children}</SubnetContext.Provider>
  );
}

export default SubnetProvider;
