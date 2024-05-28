/* eslint-disable react/no-unstable-nested-components */
import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AmountDenom, Cid, DenomArr, LinkWindow } from 'src/components';
import Table from 'src/components/Table/Table';
import { routes } from 'src/routes';
import { trimString } from 'src/utils/utils';
import { ContractTypes, useCybernet } from '../../../cybernet.context';
import ImgDenom from 'src/components/valueImg/imgDenom';
import { ContractWithData } from 'src/features/cybernet/types';
import { cybernetRoutes } from '../../../routes';
import styles from './ContractsTable.module.scss';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';

const columnHelper = createColumnHelper<ContractWithData>();

function ContractsTable() {
  const { contracts, selectContract, selectedContract } = useCybernet();

  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <Table
        onSelect={(row) => {
          if (!row) {
            return;
          }

          const contract = contracts[row!];
          const {
            address,
            metadata: { name },
          } = contract;
          selectContract(address);
          navigate(cybernetRoutes.verse.getLink('pussy', name));
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

            columnHelper.accessor('metadata.particle', {
              header: '',
              cell: (info) => {
                const value = info.getValue();
                const row = info.row.original;
                const type = row.metadata.types;
                const diff = type === ContractTypes.Graph ? 'easy' : 'hard';

                return (
                  <div>
                    <span
                      style={{
                        fontSize: 14,
                        color: '#A0A0A0',
                      }}
                    >
                      {diff}:
                    </span>{' '}
                    <Cid cid={value}>info</Cid>
                  </div>
                );
              },
            }),

            columnHelper.accessor('economy.staker_apr', {
              header: '',
              cell: (info) => (
                <span>
                  {Number(info.getValue()).toFixed(2)}
                  <span
                    style={{
                      fontSize: 14,
                      color: '#A0A0A0',
                    }}
                  >
                    % teach yield
                  </span>
                </span>
              ),
            }),
            columnHelper.accessor('metadata.description', {
              header: '',
              cell: (info) => {
                const value = info.getValue();

                return <Cid cid={value}>rules</Cid>;
              },
            }),
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
