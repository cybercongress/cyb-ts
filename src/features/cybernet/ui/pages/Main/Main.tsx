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
import ContractsTable from './ContractsTable/ContractsTable';

function Main() {
  const address = useCurrentAddress();

  useAdviserTexts({
    defaultText: 'welcome to Cybertensor 🤖',
  });

  const { data } = useDelegate(address);
  const currentAddressIsDelegator = !!data;

  const { data: currentStake } = useCurrentAccountStake();
  const haveStake = currentStake?.some(({ stake }) => stake > 0);

  return (
    <MainContainer resetMaxWidth>
      <Display>
        cybernet is the place, where ones brings wealth to the project, and
        others who value them. <br /> join the subnet and complete its
        enquiries, or stake on those who joined to make them more valuable.
      </Display>

      <Display noPaddingX title={<DisplayTitle title="Cybernet" />}>
        <ContractsTable />
      </Display>

      <div className={styles.actions}>
        <div className={styles.bgWrapper}>
          <Display
            title={
              <DisplayTitle
                title={
                  <div className={styles.actionTitle}>
                    <h3>stake</h3>
                    <div className={styles.apr}>
                      apr up to <br />
                      <span>35%</span>
                    </div>
                  </div>
                }
              />
            }
          >
            <p className={styles.actionText}>invest in operators subnets</p>
            <div className={styles.links}>
              <Link to={cybernetRoutes.delegators.getLink()}>operators</Link>

              {haveStake && <Link to="./staking/my">stats</Link>}
            </div>
          </Display>
        </div>

        <Display
          title={
            <DisplayTitle
              title={
                <div className={styles.actionTitle}>
                  <h3>join subnets</h3>
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

          <div className={styles.links}>
            <Link to={cybernetRoutes.subnet.getLink(0)}>root subnet</Link>

            <Link to={cybernetRoutes.subnets.getLink()}>all subnets</Link>

            {currentAddressIsDelegator && (
              <Link to={cybernetRoutes.delegator.getLink(address)}>
                my operator
              </Link>
            )}
          </div>
        </Display>

        <Display
          title={
            <DisplayTitle
              title={
                <div className={styles.actionTitle}>
                  <h3>Docs and code</h3>
                </div>
              }
            />
          }
        >
          <div className={styles.links}>
            <LinkWindow to="https://github.com/cybercongress/cybertensor">
              cli and python package
            </LinkWindow>

            <LinkWindow to="https://github.com/cybercongress/cybertensor-subnet-template">
              subnet template
            </LinkWindow>

            <LinkWindow to="https://github.com/cybercongress/cybernet">
              cosmwasm contract
            </LinkWindow>

            <LinkWindow to="https://docs.spacepussy.ai">docs</LinkWindow>
          </div>
        </Display>
      </div>
    </MainContainer>
  );
}

export default Main;
