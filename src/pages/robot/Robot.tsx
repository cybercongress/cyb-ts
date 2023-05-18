import React from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Wallet from 'src/containers/Wallet/Wallet';
import TxsTable from 'src/containers/account/component/txsTable';
import FeedsTab from 'src/containers/account/tabs/feeds';
import FollowsTab from 'src/containers/account/tabs/follows';
import Heroes from 'src/containers/account/tabs/heroes';
import GetLink from 'src/containers/account/tabs/link';
import ForceGraph from 'src/containers/forceGraph/forceGraph';
import TableDiscipline from 'src/containers/gol/table';
import IpfsSettings from 'src/containers/ipfsSettings';
import Layout from './Layout/Layout';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import Main from 'src/containers/account/tabs/main';
import RoutedEnergy from '../../containers/energy/index';
import Sigma from 'src/containers/sigma';

function IndexCheck() {
  const params = useParams();

  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const address = defaultAccount.account?.cyber.bech32;

  if (!params.address && !address) {
    return <Wallet />;
  }

  const isOwner = address === params.address;

  if (!params.address) {
    return <Navigate to={`/robot/${defaultAccount.account?.cyber.bech32}`} />;
  }

  if (!isOwner) {
    return <Navigate to="./sigma" />;
  }

  return <Wallet />;
}

function Robot() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexCheck />} />
        <Route path="drive" element={<IpfsSettings />} />
        <Route path="passport" element={<Navigate to="../" />} />
        <Route
          path="sigma"
          element={
            <div>
              <Main />

              <p>or this</p>
              <Sigma />
            </div>
          }
        />
        <Route path="badges" element={<TableDiscipline />} />
        <Route path="log" element={<FeedsTab />} />
        <Route path="timeline" element={<TxsTable />} />
        <Route path="security" element={<Heroes />} />
        <Route path="energy" element={<RoutedEnergy />} />
        <Route path="swarm" element={<FollowsTab />} />
        <Route path="cyberlinks" element={<GetLink />} />
        <Route path="brain" element={<ForceGraph />} />
        {/* <Route path="keys" element={<Keys />} /> */}
        {/* <Route path="skills" element={<Skills />} /> */}
        {/* <Route path="karma" element={<Karma />} /> */}
      </Route>
    </Routes>
  );
}

export default Robot;
