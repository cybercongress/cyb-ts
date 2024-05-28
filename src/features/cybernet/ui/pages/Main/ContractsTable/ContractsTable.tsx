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
import useParticleDetails from 'src/features/particle/useParticleDetails';

const columnHelper = createColumnHelper<ContractWithData>();

function Test({
  cid,
  fallback: F,
}: {
  cid: string;
  fallback: React.ReactNode;
}) {
  const d = useParticleDetails(cid);

  return d.data?.content || F;
}

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
          const { address, metadata: { name } = {} } = contract;
          selectContract(address);
          navigate(cybernetRoutes.verse.getLink('pussy', name || address));
        }}
        enableSorting={false}
        columns={useMemo(
          () => [
            columnHelper.accessor('metadata.name', {
              header: '',
              maxSize: 250,
              size: 0,
              cell: (info) => {
                const value = info.getValue();

                const { original } = info.row;
                const logo = original.metadata?.logo;
                const address = original.address;

                const selected = selectedContract?.address === address;

                return (
                  <div className={styles.nameCell}>
                    {selected && <span>✔</span>}

                    <Link
                      // remove
                      style={{
                        maxWidth: 100,
                        overflow: 'hidden',
                      }}
                      to={cybernetRoutes.subnets.getLink(
                        'pussy',
                        value || address
                      )}
                    >
                      <AvataImgIpfs cidAvatar={logo} />
                      {value || address}
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

                if (!row.metadata) {
                  return '-';
                }

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
                    <Test cid={value} fallback={<Cid cid={value}>info</Cid>} />
                  </div>
                );
              },
            }),

            columnHelper.accessor('economy.staker_apr', {
              header: '',
              cell: (info) => {
                const value = info.getValue();

                if (!value) {
                  return '-';
                }

                return (
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
                );
              },
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
