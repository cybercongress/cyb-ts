import { Account, AmountDenom, MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { routes as cybernetRoutes } from '../../routes';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import useCurrentAccountStake from '../../hooks/useCurrentAccountStake';
import { StakeInfo } from 'src/features/cybernet/types';

type T = StakeInfo[0];
const columnHelper = createColumnHelper<T>();

function MyStake() {
  const { loading, error, data } = useCurrentAccountStake();

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
      <Display noPaddingX title={<DisplayTitle title="My stake" />}>
        {content}
      </Display>
    </MainContainer>
  );
}

export default MyStake;
