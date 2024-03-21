import React from 'react';
import { Link } from 'react-router-dom';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { SubnetNeuron } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';

type Props = {
  neurons: SubnetNeuron[];
};

const columnHelper = createColumnHelper<any>();

function SubnetNeurons({ neurons }: Props) {
  return (
    <div>
      <Display
        // noPaddingX
        title={<DisplayTitle title="Neurons" />}
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

                console.log('hotkey', hotkey);

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
