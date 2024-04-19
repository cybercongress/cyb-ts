import React from 'react';
import { Link } from 'react-router-dom';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { SubnetInfo, SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';

type Props = {
  neurons: SubnetNeuron[];
  subnetType: SubnetInfo['network_modality'];
};

const columnHelper = createColumnHelper<any>();

function SubnetNeurons({ neurons, subnetType }: Props) {
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
          ]}
          data={neurons}
        />
      </Display>
    </div>
  );
}

export default SubnetNeurons;
