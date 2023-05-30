import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Wallet from 'src/containers/Wallet/Wallet';
import TxsTable from 'src/containers/account/component/txsTable';
import FeedsTab from 'src/containers/account/tabs/feeds';
import FollowsTab from 'src/containers/account/tabs/follows';
import Heroes from 'src/containers/account/tabs/heroes';
import ForceGraph from 'src/containers/forceGraph/forceGraph';
import TableDiscipline from 'src/containers/gol/table';
import IpfsSettings from 'src/containers/ipfsSettings';
import Layout from './Layout/Layout';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import RoutedEnergy from '../../containers/energy/index';
import Sigma from 'src/containers/sigma';
import Taverna from 'src/containers/taverna';

function IndexCheck() {
  const params = useParams();

  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const address = defaultAccount.account?.cyber?.bech32;

  const username = params.username && params.username.includes('@');

  if (username) {
    return <div>robot page with passport</div>;
  }

  if (!params.address && !address) {
    return <Wallet />;
  }

  const isOwner = address === params.address;

  if (!params.address) {
    return <Navigate to={`/neuron/${address}`} replace />;
  }

  if (!isOwner) {
    return <Navigate to="./sigma" replace />;
  }

  return <Wallet />;
}

function Robot() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexCheck />} />
        <Route path="passport" element={<Navigate to="../" />} />
        <Route path="drive" element={<IpfsSettings />} />
        <Route path="security" element={<Heroes />} />
        <Route path="timeline" element={<TxsTable />} />

        <Route path="sigma" element={<Sigma />} />
        <Route path="sense" element={<Taverna />} />
        <Route path="badges" element={<TableDiscipline />} />
        <Route path="log" element={<FeedsTab />} />
        <Route path="energy/*" element={<RoutedEnergy />} />
        <Route path="swarm" element={<FollowsTab />} />
        <Route path="brain" element={<ForceGraph />} />

        {/* <Route path="cyberlinks" element={<GetLink />} /> */}
        {/* <Route path="keys" element={<Keys />} /> */}
        {/* <Route path="skills" element={<Skills />} /> */}
        {/* <Route path="karma" element={<Karma />} /> */}
      </Route>
    </Routes>
  );
}

export default Robot;
