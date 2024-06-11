/* eslint-disable react/no-unstable-nested-components */
import { Link } from 'react-router-dom';
import { SubnetNeuron, Weight } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { routes } from 'src/routes';
import { Account, AmountDenom, Tooltip } from 'src/components';
import { useSubnet } from '../../../subnet.context';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import { useAppData } from 'src/contexts/appData';
import GradeSetterInput from '../../../GradeSetterInput/GradeSetterInput';
import { useMemo } from 'react';
import useCybernetTexts from 'src/features/cybernet/ui/useCybernetTexts';
import {
  useCurrentContract,
  useCybernet,
} from 'src/features/cybernet/ui/cybernet.context';
import { getColor } from '../../Weights/WeightsTable/WeightsTable';
import colorStyles from '../../Weights/WeightsTable/temp.module.scss';
import { checkIsMLVerse } from 'src/features/cybernet/ui/utils/verses';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';
import AdviserHoverWrapper from 'src/features/adviser/AdviserHoverWrapper/AdviserHoverWrapper';
import { getAverageGrade } from '../../../useCurrentSubnetGrades';

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
    // max_weights_limit: maxWeightsLimit,
    // max_allowed_validators: maxAllowedValidators,
  } = subnetQuery?.data || {};

  const address = useCurrentAddress();

  const neurons = neuronsQuery?.data || [];

  const { block } = useAppData();

  const { getText } = useCybernetTexts();

  const rootSubnet = netuid === 0;

  const vievedBlocks = getData(address);
  const { selectedContract } = useCybernet();

  const { type } = useCurrentContract();

  const isMLVerse = checkIsMLVerse(type);

  const cur = vievedBlocks?.[address]?.[netuid];

  const columns = useMemo(() => {
    const col = [
      columnHelper.accessor('uid', {
        header: getText('uid'),
        cell: (info) => {
          const uid = info.getValue();
          return uid;
        },
      }),
      columnHelper.accessor('hotkey', {
        header: getText(rootSubnet ? 'rootValidator' : 'delegate'),
        size: 200,
        enableSorting: false,
        cell: (info) => {
          const hotkey = info.getValue();
          const { validator_permit: validatorPermit } = info.row.original;

          const isProfessor = !!validatorPermit;

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0 7px',
              }}
            >
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

              {isProfessor && (
                <AdviserHoverWrapper adviserContent="this neuron is professor">
                  <span>💼</span>
                </AdviserHoverWrapper>
              )}
            </div>
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
                    routes.oracle.ask.getLink(metadata.particle) +
                    `?neuron=${hotkey}&subnet=${netuid}`
                  }
                >
                  <Tooltip
                    tooltip={`check what job have been done by this ${getText(
                      'delegate'
                    )}`}
                  >
                    🔍
                  </Tooltip>
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
        // TODO: refactor to use neuronStake
        columnHelper.accessor('stake', {
          header: 'teaching power',
          id: 'stake',
          sortingFn: (rowA, rowB) => {
            const a = rowA.original.stake.reduce((acc, s) => acc + s[1], 0);
            const b = rowB.original.stake.reduce((acc, s) => acc + s[1], 0);

            return a - b;
          },
          cell: (info) => {
            const stake = info.getValue();

            const total = stake.reduce((acc, s) => acc + s[1], 0);
            return <IconsNumber value={total} type="pussy" />;
          },
        }),
        columnHelper.accessor('validator_trust', {
          header: `trust`,
          cell: (info) => {
            const validatorTrust = info.getValue();
            const formatted = ((validatorTrust / 65536) * 100).toFixed(2);

            return `${formatted}%`;
          },
        }),
        columnHelper.accessor('emission', {
          header: 'last rewards',
          cell: (info) => {
            const emission = info.getValue();
            return <IconsNumber value={emission} type="pussy" />;
          },
        }),

        columnHelper.accessor('uid', {
          header: 'grade',
          id: 'grade',
          sortingFn: (rowA, rowB) => {
            const a = getAverageGrade(allGrades, rowA.original.uid);
            const b = getAverageGrade(allGrades, rowB.original.uid);

            return a - b;
          },
          cell: (info) => {
            const uid = info.getValue();

            if (!allGrades) {
              return null;
            }

            const avg = getAverageGrade(allGrades, uid);

            const color = getColor(avg);

            return <span className={colorStyles[`color_${color}`]}>{avg}</span>;
          },
        })
      );

      if (addressRegisteredInSubnet && !isMLVerse) {
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
    isMLVerse,
    // block,
    selectedContract,
    // cur,
    metadata,
    netuid,
    addressRegisteredInSubnet,
    rootSubnet,
    address,
  ]);

  return (
    <Table
      columns={columns}
      data={neurons}
      isLoading={neuronsQuery?.loading}
      initialState={{
        sorting: [
          {
            id: 'grade',
            desc: true,
          },
        ],
      }}
    />
  );
}

export default SubnetNeuronsTable;
