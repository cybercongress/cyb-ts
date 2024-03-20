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

function Delegator() {
  const { id } = useParams();

  const currentAddress = useAppSelector(selectCurrentAddress);

  const { data, loading, error, refetch } =
    useQueryCybernetContract<DelegatorType>({
      query: {
        get_delegate: {
          delegate: id,
        },
      },
    });

  useAdviserTexts({
    isLoading: loading,
    error,
    defaultText: 'delegator info',
  });

  console.log(data);

  const myStake = data?.nominators.find(
    ([address]) => address === currentAddress
  )?.[1];

  return (
    <MainContainer>
      <Display
        title={
          <DisplayTitle>
            <Account address={id} />
          </DisplayTitle>
        }
      >
        <ul>
          {data &&
            Object.keys(data).map((item) => {
              const value = data[item];
              let content = value;

              if (item === 'owner') {
                content = (
                  <Link to={routes.neuron.getLink(value)}>{value}</Link>
                );
              }

              if (item === 'nominators') {
                content = (
                  <ul className={styles.nominators}>
                    {value.map(([address, amount]) => {
                      return (
                        <li key={address}>
                          {' '}
                          <Link to={routes.neuron.getLink(address)}>
                            {address}
                          </Link>
                          <p>
                            Amount: {amount} <DenomArr denomValue="pussy" />
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              if (item === 'registrations') {
                content = (
                  <ul>
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
                  {item}: {content}
                </li>
              );
            })}
        </ul>
      </Display>

      {myStake && (
        <Display title={<DisplayTitle title="My stake" />}>{myStake}</Display>
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
