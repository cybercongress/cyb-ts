/* eslint-disable react/no-unstable-nested-components */
import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AmountDenom, Cid, DenomArr, LinkWindow } from 'src/components';
import Table from 'src/components/Table/Table';
import { routes } from 'src/routes';
import { trimString } from 'src/utils/utils';
import { useCybernet } from '../../../cybernet.context';
import ImgDenom from 'src/components/valueImg/imgDenom';
import { ContractWithData } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../routes';
import styles from './ContractsTable.module.scss';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';

const columnHelper = createColumnHelper<ContractWithData>();

function ContractsTable() {
  const { contracts, selectContract, selectedContract } = useCybernet();

  return (
    <div className={styles.wrapper}>
      <Table
        onSelect={(row) => {
          const address = contracts[row!] ? contracts[row!].address : '';
          selectContract(address);
        }}
        enableSorting={false}
        columns={useMemo(
          () => [
            columnHelper.accessor('metadata.name', {
              header: '',
              // minSize: 150,
              size: 0,
              cell: (info) => {
                const value = info.getValue();

                const logo = info.row.original.metadata?.logo;

                const selected = selectedContract?.metadata?.name === value;

                return (
                  <div className={styles.nameCell}>
                    {selected && <span>✔</span>}

                    <Link to={cybernetRoutes.subnets.getLink('pussy', value)}>
                      <AvataImgIpfs cidAvatar={logo} />
                      {value}
                    </Link>
                  </div>
                );
              },
            }),
            columnHelper.accessor('metadata.description', {
              header: '',
              cell: (info) => {
                const value = info.getValue();

                return <Cid cid={value}>{trimString(value, 6, 6)}</Cid>;
              },
            }),
            columnHelper.accessor('economy.staker_apr', {
              header: '',
              cell: (info) => (
                <span>{Number(info.getValue()).toFixed(2)}%</span>
              ),
            }),
            // columnHelper.accessor('docs', {
            //   header: '',
            //   cell: (info) => {
            //     // const value = info.getValue();
            //     const value = 'https://docs.spacepussy.ai';

            //     return <LinkWindow to={value}>docs</LinkWindow>;
            //   },
            // }),
            columnHelper.accessor('address', {
              header: '',
              id: 'network',
              cell: (info) => {
                const value = info.getValue();

                return <DenomArr type="network" denomValue="space-pussy" />;
              },
            }),
            columnHelper.accessor('address', {
              header: '',
              cell: (info) => {
                const value = info.getValue();

                if (value === '-') {
                  return '-';
                }

                return (
                  <Link to={routes.contracts.byId.getLink(value)}>
                    {trimString(value, 9, 3)}
                  </Link>
                );
              },
            }),
          ],
          [selectedContract]
        )}
        data={contracts}
      />
    </div>
  );
}

export default ContractsTable;
