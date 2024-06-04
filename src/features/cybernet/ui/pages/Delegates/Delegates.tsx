import React from 'react';
import { Delegator } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import DelegatesTable from './DelegatesTable/DelegatesTable';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { MainContainer } from 'src/components';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import useCybernetTexts from '../../useCybernetTexts';
import { useDelegates } from '../../hooks/useDelegate';

function Delegates() {
  const { loading, error } = useDelegates();

  const { getText } = useCybernetTexts();

  useAdviserTexts({
    isLoading: loading,
    error,
    defaultText: `choose ${getText('delegate')} for learning`,
  });

  return (
    <Display
      noPaddingX
      title={<DisplayTitle title={getText('delegate', true)} />}
    >
      <DelegatesTable />
    </Display>
  );
}

export default Delegates;
