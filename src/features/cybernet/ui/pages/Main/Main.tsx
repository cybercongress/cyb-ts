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
import useDelegate from '../../hooks/useDelegate';
import { routes } from 'src/routes';

function Main() {
  const address = useCurrentAddress();

  useAdviserTexts({
    defaultText: 'welcome to Cybernet 🤖',
  });

  const { data } = useDelegate(address);
  const currentAddressIsDelegator = !!data;

  const { data: currentStake } = useCurrentAccountStake();
  const haveStake = currentStake?.some(({ stake }) => stake > 0);

  return (
    <MainContainer resetMaxWidth>
      <Display title={<DisplayTitle title="Cybernet" />}>
        <p className={styles.info}>
          cybernet is the place, where ones brings wealth to the project, and
          others who value them. <br /> join the subnet and complete its
          enquiries, or stake on those who joined to make them more valuable.
        </p>
      </Display>

      <div className={styles.actions}>
        <Display
          title={
            <DisplayTitle
              title={
                <div className={styles.actionTitle}>
                  stake
                  <div className={styles.apr}>
                    apr up to <br />
                    <span>35%</span>
                  </div>
                </div>
              }
            />
          }
        >
          <p className={styles.actionText}>stake on creators in subnets</p>
          <Link to={cybernetRoutes.delegators.getLink()}>all creators</Link>

          {haveStake && (
            <>
              <br />
              <Link to="./staking/my">My stake</Link>
            </>
          )}
        </Display>

        <Display
          title={
            <DisplayTitle
              title={
                <div className={styles.actionTitle}>
                  join subnets
                  <div className={styles.apr}>
                    apr up to
                    <span>35%</span>
                  </div>
                </div>
              }
            />
          }
        >
          <p className={styles.actionText}>complete tasks, manage grades</p>

          <Link to={cybernetRoutes.subnet.getLink(0)}>root subnet</Link>
          <br />
          <Link to={cybernetRoutes.subnets.getLink()}>all subnets</Link>

          <br />

          {currentAddressIsDelegator && (
            <Link to={cybernetRoutes.delegator.getLink(address)}>
              My delegator
            </Link>
          )}
        </Display>

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
      </div>

      <Display title={<DisplayTitle title="Settings" />}>
        <div className={styles.settings}>
          <Select
            disabled
            title="Chain"
            valueSelect="pussy"
            options={[
              {
                value: 'pussy',
                text: '🟣 pussy',
              },
            ]}
          />

          <Input
            value={CYBERNET_CONTRACT_ADDRESS}
            disabled
            width="50%"
            title="Contract address"
          />

          <Link to={routes.contracts.byId.getLink(CYBERNET_CONTRACT_ADDRESS)}>
            link
          </Link>
        </div>
      </Display>
    </MainContainer>
  );
}

export default Main;
