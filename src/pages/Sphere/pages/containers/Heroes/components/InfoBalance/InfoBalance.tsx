import { Pane } from '@cybercongress/gravity';
import { CardStatisics, Dots } from 'src/components';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';
import { BASE_DENOM } from 'src/constants/config';
import { useGetBalance } from 'src/containers/sigma/hooks/utils';

function ContainerGrid({ children }) {
  return (
    <Pane
      marginTop={10}
      marginBottom={50}
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
      gridGap="20px"
    >
      {children}
    </Pane>
  );
}

function InfoBalance({
  balance,
  apr,
  isFetchingBalance,
}: {
  balance?: ReturnType<typeof useGetBalance>['data'];
  isFetchingBalance: boolean;
  apr?: string;
}) {
  return (
    <ContainerGrid>
      <CardStatisics
        title="available"
        value={
          isFetchingBalance ? (
            <Dots />
          ) : (
            <IconsNumber
              value={balance?.liquid.amount || 0}
              type={balance?.liquid.denom || BASE_DENOM}
            />
          )
        }
      />

      <CardStatisics
        title="staked"
        value={
          isFetchingBalance ? (
            <Dots />
          ) : (
            <IconsNumber
              value={balance?.frozen.amount || 0}
              type={balance?.frozen.denom || BASE_DENOM}
            />
          )
        }
      />

      <CardStatisics
        title="rewards"
        value={
          isFetchingBalance ? (
            <Dots />
          ) : (
            <IconsNumber
              value={balance?.growth.amount || 0}
              type={balance?.growth.denom || BASE_DENOM}
            />
          )
        }
      />

      {apr && <CardStatisics title="APR, %" value={apr} />}
    </ContainerGrid>
  );
}

export default InfoBalance;
