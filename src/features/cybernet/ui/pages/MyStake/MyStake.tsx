/* eslint-disable react/no-unstable-nested-components */
import { Account, AmountDenom, MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { routes as cybernetRoutes } from '../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import useCurrentAccountStake from '../../hooks/useCurrentAccountStake';
import { StakeInfo } from 'src/features/cybernet/types';
import useCybernetTexts from '../../useCybernetTexts';
import { useCurrentContract } from '../../cybernet.context';
import { Helmet } from 'react-helmet';

type T = StakeInfo[0];
const columnHelper = createColumnHelper<T>();

function MyStake() {
  const { loading, error, data } = useCurrentAccountStake();

  const { getText } = useCybernetTexts();

  const { contractName, network } = useCurrentContract();

  useAdviserTexts({
    isLoading: loading,
    error,
    defaultText: 'my stake',
  });

  const total =
    data?.reduce((acc, item) => {
      return acc + item.stake;
    }, 0) || 0;

  let content;

  if (data) {
    content = (
      <Table
        columns={[
          // @ts-ignore
          columnHelper.accessor('hotkey', {
            header: getText('delegate'),
            cell: (info) => {
              const address = info.getValue();
              return (
                <Account
                  address={address}
                  avatar
                  link={cybernetRoutes.delegator.getLink(
                    network,
                    contractName,
                    address
                  )}
                />
              );
            },
          }),
          columnHelper.accessor('stake', {
            header: 'stake',
            cell: (info) => {
              const stake = info.getValue();
              return <AmountDenom amountValue={stake} denom="pussy" />;
            },
          }),
          columnHelper.accessor('stake', {
            header: '%',
            id: 'percent',
            cell: (info) => {
              const stake = info.getValue();
              return <>{Number((stake / total).toFixed(2)) * 100}%</>;
            },
          }),
        ]}
        data={data.filter((item) => item.stake !== 0)}
      />
    );
  } else if (!loading) {
    content = 'No delegation';
  }

  return (
    <MainContainer>
      <Helmet>
        <title>my learner | cyb</title>
      </Helmet>
      <Display noPaddingX title={<DisplayTitle title="My stake" />}>
        {content}
      </Display>
    </MainContainer>
  );
}

export default MyStake;
