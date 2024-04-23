import Display from 'src/components/containerGradient/Display/Display';
import { Input, MainContainer, OptionSelect, Select } from 'src/components';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { Link } from 'react-router-dom';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { cybernetRoutes } from '../../routes';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import { CYBERNET_CONTRACT_ADDRESS } from 'src/features/cybernet/constants';
import styles from './Main.module.scss';

function Main() {
  useAdviserTexts({
    defaultText: 'welcome to Cybernet 🤖',
  });

  const address = useCurrentAddress();

  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title="Cybernet" />}>
        <Link to={cybernetRoutes.subnets.getLink()}>Subnets</Link>
        <br />
        <Link to={cybernetRoutes.subnet.getLink(0)}>Root subnet</Link>
        <br />
        <br />
        <Link to={cybernetRoutes.delegators.getLink()}>Delegators</Link>
      </Display>

      <Display title={<DisplayTitle title="My" />}>
        <Link to="./staking/my">Stake</Link>
        <br />
        <Link to={cybernetRoutes.delegator.getLink(address)}>Delegator</Link>
      </Display>

      <Display title={<DisplayTitle title="Settings" />}>
        <div className={styles.settings}>
          <Select
            disabled
            title="Chain"
            valueSelect="pussy"
            options={[
              {
                value: 'pussy',
                text: 'pussy',
              },
            ]}
          />

          <Input
            value={CYBERNET_CONTRACT_ADDRESS}
            disabled
            width="50%"
            title="Contract address"
          />
        </div>
      </Display>
    </MainContainer>
  );
}

export default Main;
