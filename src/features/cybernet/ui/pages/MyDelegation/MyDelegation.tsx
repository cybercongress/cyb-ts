import React from 'react';
import useCybernetContract from 'src/features/cybernet/useContract';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import Delegator from '../Delegator/Delegator';
import { MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import { Link } from 'react-router-dom';
import { routes } from 'src/routes';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';

function MyDelegation() {
  //   const w = 'pussy1628xzz8mhhu9mekk3tat4jj0vymtzachuhtyfe';

  const t = useAppSelector(selectCurrentAddress);

  console.log(t);

  const { data, loading, error } = useCybernetContract<Delegator>({
    query: {
      get_delegate: {
        delegate: t,
      },
    },
  });

  console.log(data);

  const total =
    data &&
    data.nominators.reduce((acc, item) => {
      return acc + item[1];
    }, 0);

  let content;

  if (data) {
    content = (
      <>
        <p>will be table</p>
        <br />
        <ul>
          {data &&
            data.nominators.map((item) => {
              const [address, amount] = item;

              console.log(item);

              return (
                <li key={address}>
                  <Link to={routes.neuron.getLink(address)}>{address}</Link>{' '}
                  <br />
                  {amount}
                  <br />
                  {(amount / total).toFixed(2)}%
                  <hr />
                </li>
              );
            })}
        </ul>
      </>
    );
  } else if (!loading) {
    content = 'No delegation';
  }

  return (
    <MainContainer>
      <Display title={<DisplayTitle title={'My delegation'} />}>
        {content}
      </Display>
    </MainContainer>
  );
}

export default MyDelegation;
