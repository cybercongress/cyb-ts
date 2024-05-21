import React, { useEffect, useMemo, useState } from 'react';
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

export function getAverageGrade(grades, uid: string) {
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

const SubnetContext = React.createContext<{
  subnetQuery: ReturnType<typeof useCybernetContract<SubnetInfo>>;
  neuronsQuery: ReturnType<typeof useCybernetContract<SubnetNeuron[]>>;
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
  const netuid = Number(id!);

  const [newGrades, setNewGrades] = useState<{
    [uid: string]: number;
  }>({});

  const currentAddress = useCurrentAddress();

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
    return grades?.[myUid] || {};
  }, [grades, myUid]);

  useEffect(() => {
    setNewGrades(gradesFromMe);
  }, [gradesFromMe]);

  function setGrade(uid: string, grade: number) {
    setNewGrades((prev) => ({
      ...prev,
      [uid]: grade,
    }));
  }

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
      debugger;
      setAdviser('Weights set', 'green');
      weightsQuery.refetch();
    },
  });

  const value = useMemo(() => {
    return {
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
          setGrade: setGrade,
          save: submit,
          isGradesUpdated: !isEqual(newGrades, gradesFromMe),
        },
      },
    };
  }, [
    subnetQuery,
    neuronsQuery,
    weightsQuery,
    grades,
    gradesFromMe,
    newGrades,
    submit,
  ]);

  return (
    <SubnetContext.Provider value={value}>{children}</SubnetContext.Provider>
  );
}

export default SubnetProvider;
