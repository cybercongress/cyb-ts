import Display from 'src/components/containerGradient/Display/Display';
import {
  Input,
  LinkWindow,
  MainContainer,
  OptionSelect,
  Select,
} from 'src/components';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { Link } from 'react-router-dom';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import { cybernetRoutes } from '../../routes';
import useCurrentAddress from 'src/features/cybernet/_move/useCurrentAddress';
import { CYBERNET_CONTRACT_ADDRESS } from 'src/features/cybernet/constants';
import styles from './Main.module.scss';
import useCurrentAccountStake from '../../hooks/useCurrentAccountStake';

function Main() {
  const address = useCurrentAddress();

  useAdviserTexts({
    defaultText: 'welcome to Cybernet 🤖',
  });

  const { data: currentStake } = useCurrentAccountStake();
  const haveStake = currentStake?.some(({ stake }) => stake > 0);

  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title="Cybernet" />}>
        <p>
          cybernet is the place, where ones brings wealth to the project, and
          others who value them. join the subnet and complete its enquiries, or
          stake on those who joined to make them more valuable.
        </p>
      </Display>

      <div className={styles.actions}>
        <Display>
          <Link to={cybernetRoutes.delegators.getLink()}>Stake</Link>

          {haveStake && (
            <>
              <br />
              <Link to="./staking/my">My stake</Link>
            </>
          )}
        </Display>

        <Display>
          <Link to={cybernetRoutes.subnets.getLink()}>Join subnets</Link>

          <br />

          <Link to={cybernetRoutes.delegator.getLink(address)}>
            My delegator
          </Link>
        </Display>
      </div>

      <Display title={<DisplayTitle title="Docs and code" />}>
        <div className={styles.externalLinks}>
          <LinkWindow to="https://github.com/cybercongress/cybertensor">
            cli and python package
          </LinkWindow>

          <LinkWindow to="https://github.com/cybercongress/cybertensor-subnet-template">
            subnet template
          </LinkWindow>

          <LinkWindow to="https://github.com/cybercongress/cybernet">
            cosmwasm contract
          </LinkWindow>

          <LinkWindow to="http://159.89.24.179:4000/">docs</LinkWindow>
        </div>
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
