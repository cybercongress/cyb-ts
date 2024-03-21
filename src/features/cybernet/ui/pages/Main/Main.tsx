import Display from 'src/components/containerGradient/Display/Display';
import { MainContainer } from 'src/components';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { Link } from 'react-router-dom';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { cybernetRoutes } from '../../routes';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';

function Main() {
  useAdviserTexts({
    defaultText: 'welcome to Cybernet',
  });

  const address = useCurrentAddress();

  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title="Cybernet" />}>
        <Link to={cybernetRoutes.subnets.getLink()}>Subnets</Link>
        <br />
        <Link to={cybernetRoutes.delegators.getLink()}>Delegators</Link>

        <br />
        <br />
        <br />

        <h3>My</h3>
        <br />

        <Link to="./staking/my">Stake</Link>
        <br />
        <Link to={cybernetRoutes.delegator.getLink(address)}>Delegator</Link>
      </Display>
    </MainContainer>
  );
}

export default Main;
