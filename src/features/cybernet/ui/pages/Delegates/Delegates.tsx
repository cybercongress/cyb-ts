import React from 'react';
import { Delegator } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import DelegatorsTable from './DelegatorsTable/DelegatorsTable';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { MainContainer } from 'src/components';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';

function Delegates() {
  const { data, loading, error } = useCybernetContract<Delegator>({
    query: {
      get_delegates: {},
    },
  });

  useAdviserTexts({
    isLoading: loading,
    error,
    defaultText: 'Delegators',
  });

  console.log(data);

  return (
    <MainContainer>
      <Display noPaddingX title={<DisplayTitle title="Delegators" />}>
        <DelegatorsTable data={data || []} />
      </Display>
    </MainContainer>
  );
}

export default Delegates;
