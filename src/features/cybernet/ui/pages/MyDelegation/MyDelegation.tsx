import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import { DenomArr, MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import { Link } from 'react-router-dom';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { StakeInfo } from 'src/features/cybernet/types';
import { routes as cybernetRoutes } from '../../routes';
import styles from './MyDelegation.module.scss';
import { data } from '../../../../ipfs/Drive/index';
import Table from 'src/components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';

// mixed with my delegation, refactor

const columnHelper = createColumnHelper<any>();

function MyDelegation() {
  const currentAddress = useAppSelector(selectCurrentAddress);

  const { data, loading, error } = useCybernetContract<StakeInfo>({
    query: {
      get_stake_info_for_coldkey: {
        coldkey: currentAddress,
      },
    },
    skip: !currentAddress,
  });

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
      <>
        {/* TODO: need table */}

        <Table
          columns={[
            columnHelper.accessor('hotkey', {
              header: 'hotkey',
              cell: (info) => {
                const hotkey = info.getValue();
                return (
                  <Link to={cybernetRoutes.delegator.getLink(hotkey)}>
                    {hotkey.slice(0, 6)}...{hotkey.slice(-6)}
                  </Link>
                );
              },
            }),
            columnHelper.accessor('stake', {
              header: 'stake',
              cell: (info) => {
                const stake = info.getValue();
                return (
                  <>
                    {stake.toLocaleString()} 🟣
                    {/* <DenomArr denomValue="pussy" onlyImg /> */}
                  </>
                );
              },
            }),
            columnHelper.accessor('stake', {
              header: '%',
              cell: (info) => {
                const stake = info.getValue();
                return (
                  <>
                    {' '}
                    {stake !== 0 && (
                      <>{Number((stake / total).toFixed(2)) * 100}%</>
                    )}
                  </>
                );
              },
            }),
          ]}
          data={data}
        />
      </>
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

export default MyDelegation;
