/* eslint-disable react/no-unstable-nested-components */
import { Link } from 'react-router-dom';
import { SubnetNeuron, Weight } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { routes } from 'src/routes';
import { Account } from 'src/components';
import { getAverageGrade, useSubnet } from '../../../subnet.context';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import { useAppData } from 'src/contexts/appData';
import GradeSetterInput from '../../../GradeSetterInput/GradeSetterInput';
import { useMemo } from 'react';
import useCybernetTexts from 'src/features/cybernet/ui/useCybernetTexts';
import {
  useCurrentContract,
  useCybernet,
} from 'src/features/cybernet/ui/cybernet.context';

type Props = {};

const columnHelper = createColumnHelper<SubnetNeuron>();

const key = 'subnetNeuronViewedBlock';

function getKey(address: string) {
  return `${key}_${address}`;
}

type LSType = {
  // current address
  [key: string]: {
    // subnet
    [key: string]: {
      // neuron
      [key: string]: number;
    };
  };
};

function getData(address: string) {
  const data = localStorage.getItem(getKey(address));

  return data ? (JSON.parse(data) as LSType) : null;
}

function save(data: LSType, address: string) {
  localStorage.setItem(getKey(address), JSON.stringify(data));
}

function handleSave(
  neuron: string,
  subnetId: number,
  block: number,
  currentAddress: string
) {
  let data = getData(currentAddress);

  if (!data) {
    data = {};
  }

  if (!data[currentAddress]) {
    data[currentAddress] = {};
  }

  data[currentAddress] = {
    ...data[currentAddress],
    [subnetId]: {
      ...data[currentAddress][subnetId],
      [neuron]: block,
    },
  };

  save(data, currentAddress);
}

function SubnetNeuronsTable({}: Props) {
  const {
    subnetQuery,
    addressRegisteredInSubnet,
    neuronsQuery,
    grades: {
      all: { data: allGrades },
    },
  } = useSubnet();
  const {
    netuid,
    metadata,
    max_weights_limit: maxWeightsLimit,
  } = subnetQuery?.data || {};

  const address = useCurrentAddress();

  const neurons = neuronsQuery?.data || [];

  const { block } = useAppData();

  const { getText } = useCybernetTexts();

  const rootSubnet = netuid === 0;

  const vievedBlocks = getData(address);
  const { selectedContract } = useCybernet();

  const cur = vievedBlocks?.[address]?.[netuid];

  const columns = useMemo(() => {
    const col = [
      columnHelper.accessor('uid', {
        header: 'uid',
        cell: (info) => {
          const uid = info.getValue();
          return uid;
        },
      }),
      columnHelper.accessor('hotkey', {
        header: getText('validator'),
        // size: 200,
        enableSorting: false,
        cell: (info) => {
          const hotkey = info.getValue();

          return (
            <Account
              address={hotkey}
              avatar
              markCurrentAddress
              link={cybernetRoutes.delegator.getLink(
                'pussy',
                selectedContract?.metadata?.name,
                hotkey
              )}
            />
          );
        },
      }),
    ];

    if (!rootSubnet) {
      col.push(
        // @ts-ignore
        columnHelper.accessor('hotkey', {
          header: 'job done',
          id: 'metadata',
          enableSorting: false,
          cell: (info) => {
            const hotkey = info.getValue();

            if (!metadata) {
              return null;
            }

            const viewedBlock = cur?.[hotkey];

            return (
              <>
                <Link
                  onClick={() => {
                    if (!block) {
                      return;
                    }

                    handleSave(hotkey, netuid, +block, address);
                  }}
                  to={
                    routes.oracle.ask.getLink(metadata) +
                    `?neuron=${hotkey}&subnet=${netuid}`
                  }
                >
                  🔍
                </Link>

                <br />
                {viewedBlock && block && (
                  <span
                    style={{
                      fontSize: 14,
                    }}
                  >
                    (viewed {block - viewedBlock} blocks ago)
                  </span>
                )}
              </>
            );
          },
        }),
        columnHelper.accessor('uid', {
          header: 'grade',
          id: 'grade',
          cell: (info) => {
            const uid = info.getValue();

            if (!allGrades) {
              return null;
            }

            const avg = getAverageGrade(allGrades, uid);

            return avg;
          },
        })
      );

      if (addressRegisteredInSubnet) {
        col.push(
          // @ts-ignore
          columnHelper.accessor('uid', {
            id: 'setGrade',
            header: 'Set grade',
            enableSorting: false,
            cell: (info) => {
              const uid = info.getValue();

              return <GradeSetterInput key={uid} uid={uid} />;
            },
          })
        );
      }
    }

    return col;
  }, [
    allGrades,
    // block,
    selectedContract,
    // cur,
    metadata,
    netuid,
    addressRegisteredInSubnet,
    rootSubnet,
    address,
  ]);

  return <Table columns={columns} data={neurons} />;
}

export default SubnetNeuronsTable;
