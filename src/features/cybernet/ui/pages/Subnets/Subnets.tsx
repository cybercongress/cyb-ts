import React, { useEffect } from 'react';
import ActionBar from '../Main/ActionBar';
import { MainContainer } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import RootSubnetsTable from '../../RootSubnetsTable/RootSubnetsTable';
import { useAdviser } from 'src/features/adviser/context';
import { SubnetInfo } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/useContract';

function Subnets() {
  const { data, loading, error } = useCybernetContract<SubnetInfo>({
    query: {
      get_subnets_info: {},
    },
  });

  const { setAdviser } = useAdviser();
  useEffect(() => {
    let text;
    let color;
    if (error) {
      text = error.message;
      color = 'red';
    } else if (loading) {
      text = 'loading...';
      color = 'yellow';
    } else {
      text = 'subnets';
    }

    setAdviser(text, color);
  }, [setAdviser, loading, error]);

  console.log(data);

  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title={'Subnets'} />}>
        <RootSubnetsTable data={data || []} />
      </Display>

      <ActionBar />
    </MainContainer>
  );
}

export default Subnets;
