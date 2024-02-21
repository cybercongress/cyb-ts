import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Account, MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { Delegator, SubnetInfo } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/useContract';
import { routes } from 'src/routes';

function Delegator() {
  const { id } = useParams();

  const { data, loading, error } = useCybernetContract<Delegator>({
    query: {
      get_delegate: {
        delegate: id,
      },
    },
  });

  console.log(data);

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
                  <ul>
                    {value.map((val) => {
                      return (
                        <li key={val}>
                          {' '}
                          <Link to={routes.neuron.getLink(val)}>{val}</Link>
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
    </MainContainer>
  );
}

export default Delegator;
