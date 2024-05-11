/* eslint-disable react/no-unstable-nested-components */
import { Link } from 'react-router-dom';
import { SubnetNeuron, Weight } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { routes } from 'src/routes';
import { Account } from 'src/components';
import { useSubnet } from '../../../subnet.context';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import { useAppData } from 'src/contexts/appData';
import { formatWeightToGrade } from 'src/features/cybernet/ui/utils/formatWeight';

type Props = {
  neurons: SubnetNeuron[];
  addressRegisteredInSubnet: boolean;
  weights: Weight[];
};

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

function SubnetNeuronsTable({
  neurons,
  // addressRegisteredInSubnet,
  weights,
}: Props) {
  const { subnetQuery } = useSubnet();
  const {
    netuid,
    metadata,
    max_weights_limit: maxWeightsLimit,
  } = subnetQuery?.data || {};

  const address = useCurrentAddress();

  const { block } = useAppData();

  const myUid = neurons.find((n) => n.hotkey === address)?.uid;

  const vievedBlocks = getData(address);

  const cur = vievedBlocks?.[address]?.[netuid];

  const columns = [
    columnHelper.accessor('uid', {
      header: 'uid',
      cell: (info) => {
        const uid = info.getValue();

        return uid;
      },
    }),
    columnHelper.accessor('hotkey', {
      header: 'neuron',
      cell: (info) => {
        const hotkey = info.getValue();

        return (
          <Account
            address={hotkey}
            avatar
            markCurrentAddress
            link={cybernetRoutes.delegator.getLink(hotkey)}
          />
        );
      },
    }),

    columnHelper.accessor('hotkey', {
      header: 'metadata',
      id: 'metadata',
      cell: (info) => {
        const hotkey = info.getValue();

        if (!metadata) {
          return null;
        }

        const vievedBlock = cur?.[hotkey];

        return (
          <>
            <Link
              onClick={(e) => {
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
              {/* <Cid cid={metadata}> */}
              🔍
              {/* {`${metadata.substr(0, 6)}...${metadata.substr(-6)}`} */}
              {/* </Cid> */}
            </Link>

            <br />
            {vievedBlock && block && (
              <span
                style={{
                  fontSize: 14,
                }}
              >
                (viewed {block - vievedBlock} blocks ago)
              </span>
            )}
          </>
        );
      },
    }),

    // columnHelper.accessor('uid', {
    //   header: 'grade (WIP)',
    //   id: 'grade',

    //   cell: (info) => {
    //     const i = info.getValue();

    //     if (!weights) {
    //       return;
    //     }

    //     const mWeihts = weights[myUid];

    //     console.log(mWeihts, 'mWeihts');

    //     if (!mWeihts) {
    //       return;
    //     }

    //     const t = mWeihts.find(([id, value]) => id === i)?.[1];

    //     if (t === undefined) {
    //       return '-';
    //     }

    //     // return formatWeightToGrade(t, maxWeightsLimit);

    //     const g = weights[i];
    //     const sum = g.reduce((acc, [id, value]) => acc + value, 0);
    //     const average = sum / g.length;

    //     // if (Number.isNaN(average) || Number.isNaN(t)) {
    //     //   debugger;
    //     // }

    //     return (
    //       <div>
    //         {formatWeightToGrade(average, maxWeightsLimit)}
    //         <br />
    //         (my
    //         {formatWeightToGrade(t, maxWeightsLimit)})
    //       </div>
    //     );
    //   },
    // }),
  ];
  return <Table columns={columns} data={neurons} />;
}

export default SubnetNeuronsTable;
