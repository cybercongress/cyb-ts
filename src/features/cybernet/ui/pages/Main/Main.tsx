import Display from 'src/components/containerGradient/Display/Display';
import { MainContainer } from 'src/components';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { Link } from 'react-router-dom';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { cybernetRoutes } from '../../routes';

function Main() {
  useAdviserTexts({
    defaultText: 'welcome to Cybernet',
  });

  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title="Cybernet" />}>
        <Link to={cybernetRoutes.subnets.getLink()}>Subnets</Link>
        <br />
        <Link to={cybernetRoutes.delegators.getLink()}>Delegators</Link>

        <br />

        <Link to="./staking/my">My stake</Link>
      </Display>
    </MainContainer>
  );
}

export default Main;
