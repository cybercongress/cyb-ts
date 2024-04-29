import React from 'react';
import { Link } from 'react-router-dom';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { SubnetInfo, SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { routes } from 'src/routes';
import { Cid } from 'src/components';

type Props = {
  neurons: SubnetNeuron[];
  subnetType: SubnetInfo['network_modality'];
  metadata: string;
};

const columnHelper = createColumnHelper<any>();

function SubnetNeurons({ neurons, subnetType, metadata, netuid }: Props) {
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
                  <Link to={cybernetRoutes.delegator.getLink(hotkey)}>
                    {hotkey}
                  </Link>
                );
              },
            }),
            columnHelper.accessor('hotkey', {
              header: 'metadata',
              cell: (info) => {
                const hotkey = info.getValue();

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
          ]}
          data={neurons}
        />
      </Display>
    </div>
  );
}

export default SubnetNeurons;
