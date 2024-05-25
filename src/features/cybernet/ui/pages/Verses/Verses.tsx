import React from 'react';
import ContractTable from 'src/containers/wasm/contract/ContractTable';
import ContractsTable from '../Main/ContractsTable/ContractsTable';
import Display from 'src/components/containerGradient/Display/Display';
import { MainContainer } from 'src/components';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';

function Verses() {
  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title="Verses" />} noPaddingX>
        <ContractsTable />
      </Display>
    </MainContainer>
  );
}

export default Verses;
