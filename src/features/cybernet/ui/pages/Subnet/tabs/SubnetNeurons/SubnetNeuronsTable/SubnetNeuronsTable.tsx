/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { Link } from 'react-router-dom';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { SubnetInfo, SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { routes } from 'src/routes';
import { Account, Cid, Input } from 'src/components';
import { useSubnet } from '../../../subnet.context';

type Props = {
  neurons: SubnetNeuron[];
  addressRegisteredInSubnet: boolean;
};

const columnHelper = createColumnHelper<SubnetNeuron>();

function SubnetNeuronsTable({ neurons, addressRegisteredInSubnet }: Props) {
  const { subnetQuery } = useSubnet();
  const { netuid, metadata } = subnetQuery?.data || {};

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
          return;
        }

        return (
          <Link
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
        );
      },
    }),
  ];

  // if (addressRegisteredInSubnet) {
  //   columns.push(
  //     columnHelper.accessor('netuid', {
  //       id: 'weight',
  //       header: 'weight',
  //       cell: (info) => {
  //         return (
  //           <div
  //             style={{
  //               width: 200,
  //             }}
  //           ></div>
  //         );
  //       },
  //     })
  //   );
  // }
  return <Table columns={columns} data={neurons} />;
}

export default SubnetNeuronsTable;
