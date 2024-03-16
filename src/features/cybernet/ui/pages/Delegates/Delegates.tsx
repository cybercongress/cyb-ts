import React from 'react';
import { Delegator } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import DelegatorsTable from './DelegatorsTable/DelegatorsTable';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { MainContainer } from 'src/components';

function Delegates() {
  const { data, loading, error } = useCybernetContract<Delegator>({
    query: {
      get_delegates: {},
    },
  });

  console.log(data);

  return (
    <MainContainer>
      <Display title={<DisplayTitle title="Delegators" />}>
        <DelegatorsTable data={data || []} />
      </Display>
    </MainContainer>
  );
}

export default Delegates;
