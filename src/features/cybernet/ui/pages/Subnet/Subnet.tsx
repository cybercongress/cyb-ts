import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Input, MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { SubnetHyperParameters, SubnetInfo } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/useContract';
import { routes } from 'src/routes';
import WeightsTable from './WeightsTable/WeightsTable';
import WeightsSetter from './WeightsSetter/WeightsSetter';
import ActionBar from './ActionBar/ActionBar';

function Subnet() {
  const { id } = useParams();

  const [setWeightsOpen, setSetWeightsOpen] = useState(false);

  const { data, loading, error } = useCybernetContract<SubnetInfo>({
    query: {
      get_subnet_info: {
        netuid: +id,
      },
    },
  });

  const hyperparamsQuery = useCybernetContract<SubnetHyperParameters>({
    query: {
      get_subnet_hyperparams: {
        netuid: +id,
      },
    },
  });

  const weightsQuery = useCybernetContract<any>({
    query: {
      get_weights: {
        netuid: +id,
      },
    },
  });

  console.info('info', data);
  console.info('hyperparams', hyperparamsQuery);
  console.info('weights', weightsQuery);

  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title={'Subnet: ' + id} />}>
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

              if (item === 'metadata') {
                content = (
                  <Link to={routes.oracle.ask.getLink(value)}>{value}</Link>
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

      <Display title={<DisplayTitle title={'Hyperparams: '} />}>
        <ul>
          {hyperparamsQuery.data &&
            Object.keys(hyperparamsQuery.data).map((item) => {
              const value = hyperparamsQuery.data[item];
              let content = value;

              return (
                <li key={item}>
                  {item}: {content}
                </li>
              );
            })}
        </ul>
      </Display>

      {data?.subnetwork_n > 0 && (
        <Display title={<DisplayTitle title={'Weights: '} />}>
          {weightsQuery.data && <WeightsTable data={weightsQuery.data || []} />}

          {weightsQuery.data && (
            <>
              <hr />
              <WeightsSetter
                callback={() => {
                  weightsQuery.refetch();
                }}
                length={weightsQuery.data?.length}
                netuid={+id}
                max_weights_limit={data?.max_weights_limit}
              />
            </>
          )}
        </Display>
      )}

      <ActionBar netuid={+id} burn={data?.burn} />
    </MainContainer>
  );
}

export default Subnet;
