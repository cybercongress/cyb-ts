import React from 'react';
import { Link } from 'react-router-dom';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { SubnetInfo, SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { routes } from 'src/routes';
import { Account, Cid, Input } from 'src/components';

type Props = {
  neurons: SubnetNeuron[];
  subnetType: SubnetInfo['network_modality'];
  metadata: string;
  addressRegisteredInSubnet: boolean;
};

const columnHelper = createColumnHelper<any>();

function SubnetNeurons({
  neurons,
  subnetType,
  metadata,
  netuid,
  addressRegisteredInSubnet,
}: Props) {
  return (
    <div>
      <Display
        noPaddingX
        title={<DisplayTitle title={<header>Neurons</header>} />}
      >
        <Table
          columns={[
            columnHelper.accessor('uid', {
              header: 'uid',
              cell: (info) => {
                const uid = info.getValue();
                return uid;
              },
            }),
            columnHelper.accessor('hotkey', {
              header: 'hotkey',
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
                    {/* <Cid cid={metadata}> */}{' '}
                    {`${metadata.substr(0, 6)}...${metadata.substr(-6)}`}
                    {/* </Cid> */}
                  </Link>
                );
              },
            }),

            // columnHelper.accessor('weight', {
            //   id: 'weight',
            //   header: 'weight',
            //   cell: (info) => {
            //     const hotkey = info.getValue();

            //     if (!addressRegisteredInSubnet) {
            //       return;
            //     }

            //     return <Input disabled value="10" />;
            //   },
            // }),
          ]}
          data={neurons}
        />
      </Display>
    </div>
  );
}

export default SubnetNeurons;
