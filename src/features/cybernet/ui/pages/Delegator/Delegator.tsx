import { Link, useParams } from 'react-router-dom';
import { Account, DenomArr, MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import useQueryCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import { routes } from 'src/routes';

import DelegatorActionBar from './DelegatorActionBar/DelegatorActionBar';
import styles from './Delegator.module.scss';
import { Delegator as DelegatorType } from 'src/features/cybernet/types';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { routes as cybernetRoutes } from '../../routes';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import MusicalAddress from 'src/components/MusicalAddress/MusicalAddress';
import subnetStyles from '../Subnet/Subnet.module.scss';
import useDelegate from '../../hooks/useDelegate';

const columnHelper = createColumnHelper<any>();

const config: keyof DelegatorType = {
  take: {
    text: 'Commission',
  },
  validator_permits: {
    text: 'Validator permits',
  },
  total_daily_return: {
    text: 'Total daily return',
  },
  return_per_1000: {
    text: 'Return per 1000 🟣',
  },
};

function Delegator() {
  const { id } = useParams();

  const currentAddress = useAppSelector(selectCurrentAddress);

  const { loading, data, error, refetch } = useDelegate(id);

  useAdviserTexts({
    isLoading: loading,
    error,
    defaultText: 'delegator info',
  });

  const myStake = data?.nominators.find(
    ([address]) => address === currentAddress
  )?.[1];

  const nominators = data?.nominators;

  return (
    <MainContainer>
      {myStake && (
        <Display title={<DisplayTitle title="My stake" />}>
          {myStake.toLocaleString()} 🟣
        </Display>
      )}

      <Display
        noPaddingX
        title={
          <DisplayTitle
            inDisplay={false}
            title={<MusicalAddress address={id} />}
          />
        }
      >
        <ul className={subnetStyles.list}>
          {data &&
            Object.keys(data)
              .filter((item) => !['nominators', 'delegate'].includes(item))
              .map((item) => {
                const value = data[item];
                let content = value;

                if (item === 'owner') {
                  content = (
                    <Account address={value} />
                    // <Link to={routes.neuron.getLink(value)}>{value}</Link>
                  );
                }

                if (item === 'take') {
                  content = <span>{(value / 65535).toFixed(2) * 100}%</span>;
                }

                if (['total_daily_return', 'return_per_1000'].includes(item)) {
                  content = (
                    <span>
                      {value.toLocaleString()} 🟣
                      {/* <DenomArr denomValue="pussy" onlyImg /> */}
                    </span>
                  );
                }

                if (item === 'registrations' || item === 'validator_permits') {
                  content = (
                    <ul className={styles.list}>
                      {value.map((netuid) => {
                        return (
                          <li key={netuid}>
                            <Link to={cybernetRoutes.subnet.getLink(netuid)}>
                              {netuid}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  );
                }

                return (
                  <li key={item}>
                    {config[item]?.text || item}: {content}
                  </li>
                );
              })}
        </ul>
      </Display>

      {!!nominators?.length && (
        <Display
          noPaddingX
          title={<DisplayTitle title={<header>Nominators</header>} />}
        >
          <Table
            columns={[
              columnHelper.accessor('address', {
                header: 'Address',
                cell: (info) => <Account address={info.getValue()} />,
              }),
              columnHelper.accessor('amount', {
                header: 'Amount',
                cell: (info) => (
                  <>
                    {info.getValue().toLocaleString()} 🟣
                    {/* <DenomArr denomValue="pussy" onlyImg /> */}
                  </>
                ),
              }),
            ]}
            data={nominators.map(([address, amount]) => {
              return {
                address,
                amount,
              };
            })}
          />
        </Display>
      )}

      <DelegatorActionBar
        address={id}
        stakedAmount={myStake}
        onSuccess={refetch}
      />
    </MainContainer>
  );
}

export default Delegator;
