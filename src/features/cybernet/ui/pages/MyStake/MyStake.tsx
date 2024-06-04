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
import { useDelegates } from '../../hooks/useDelegate';
import DelegatesTable from '../Delegates/DelegatesTable/DelegatesTable';
import { HeaderItem } from '../Subnet/SubnetHeader/SubnetHeader';

type T = StakeInfo[0];
const columnHelper = createColumnHelper<T>();

function MyStake() {
  const { loading, error, data } = useCurrentAccountStake();

  const { getText } = useCybernetTexts();

  const delegatesQuery = useDelegates();

  const { contractName, network } = useCurrentContract();

  useAdviserTexts({
    isLoading: loading,
    error: error?.message,
    defaultText: 'my learner',
  });

  const total =
    data?.reduce((acc, item) => {
      return acc + item.stake;
    }, 0) || 0;

  return (
    <>
      <Helmet>
        <title>my learner | cyb</title>
      </Helmet>

      <Display>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <HeaderItem title="mentors" content={data?.length} />

          <HeaderItem
            title="total stake"
            content={<AmountDenom amountValue={total} denom="pussy" />}
          />
        </div>
      </Display>
      <Display noPaddingX title={<DisplayTitle title="My stake" />}>
        <DelegatesTable />
      </Display>
    </>
  );
}

export default MyStake;
