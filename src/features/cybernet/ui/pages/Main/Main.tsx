import React, { useEffect } from 'react';
import { SubnetInfo } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/useContract';
import RootSubnetsTable from '../../RootSubnetsTable/RootSubnetsTable';
import Display from 'src/components/containerGradient/Display/Display';
import { MainContainer } from 'src/components';
import { useAdviser } from 'src/features/adviser/context';
import ActionBar from './ActionBar';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { Link } from 'react-router-dom';

function Main() {
  const { setAdviser } = useAdviser();
  useEffect(() => {
    let text;
    let color;

    text = 'welcome to Cybernet';

    setAdviser(text, color);
  }, [setAdviser]);

  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title={'Cybernet'} />}>
        <Link to="./subnets">Subnets</Link>
        <br />
        <Link to="./delegates">Delegates</Link>

        <br />

        <Link to="./staking/my">My delegation</Link>
      </Display>
    </MainContainer>
  );
}

export default Main;
