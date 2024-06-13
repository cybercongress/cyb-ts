import { Loading } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import SubnetsTable from './SubnetsTable/SubnetsTable';
import styles from './Subnets.module.scss';
import { Helmet } from 'react-helmet';
import useCybernetTexts from '../../useCybernetTexts';
import { useCybernet } from '../../cybernet.context';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';

function Subnets() {
  const {
    subnetsQuery: { data, loading, error },
  } = useCybernet();

  // possible to refactor to 1 loop
  const rootSubnet = data?.find((subnet) => subnet.netuid === 0);
  const graphSubnets = data?.filter((subnet) => subnet.network_modality === 0);

  const { getText } = useCybernetTexts();

  useAdviserTexts({
    isLoading: loading,
    error,
    defaultText: 'explore the full list of faculties',
  });
  return (
    <>
      <Helmet>
        <title>{getText('subnetwork', true)} | cyb</title>
      </Helmet>
      {loading && <Loading />}

      {rootSubnet && (
        <Display
          noPaddingX
          title={
            <DisplayTitle
              title={
                <header className={styles.header}>
                  {getText('root')}
                  {/* <Tooltip tooltip="Root subnet - ...">
                    <QuestionBtn />
                  </Tooltip> */}
                </header>
              }
            />
          }
        >
          <SubnetsTable data={[rootSubnet] || []} />
        </Display>
      )}

      {!!graphSubnets?.length && (
        <Display
          noPaddingX
          title={
            <DisplayTitle
              title={
                <header className={styles.header}>
                  {getText('subnetwork', true)}
                  {/* <Tooltip tooltip="Graph subnets - ...">
                    <QuestionBtn />
                  </Tooltip> */}
                </header>
              }
            />
          }
        >
          <SubnetsTable data={graphSubnets || []} />
        </Display>
      )}
    </>
  );
}

export default Subnets;
