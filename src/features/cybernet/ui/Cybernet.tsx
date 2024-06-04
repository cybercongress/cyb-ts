import React from 'react';
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  redirect,
  Navigate,
} from 'react-router-dom';
import Main from './pages/Main/Main';
import Subnet from './pages/Subnet/Subnet';
import Delegates from './pages/Delegates/Delegates';
import Delegate from './pages/Delegate/Delegate';
import Subnets from './pages/Subnets/Subnets';
import MyStake from './pages/MyStake/MyStake';
import { Helmet } from 'react-helmet';
import CybernetProvider, {
  useCurrentContract,
  useCybernet,
} from './cybernet.context';
import Verses from './pages/Verses/Verses';
import Verse from './pages/Verse/Verse';
import { cybernetRoutes } from './routes';
import Sigma from './pages/Sigma/Sigma';
import { MainContainer } from 'src/components';

function Redirect() {
  const { contractName, network } = useCurrentContract();

  const location = useLocation();
  const { pathname } = location;

  const route =
    cybernetRoutes.verse.getLink(network, contractName) +
    pathname.replace('/cyberver', '');

  return <Navigate to={route} replace />;
}

function Cybernet() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <CybernetProvider>
              <Helmet>
                <title>cyberver | cyb</title>
              </Helmet>

              <MainContainer resetMaxWidth>
                <Outlet />
              </MainContainer>
            </CybernetProvider>
          </div>
        }
      >
        <Route index element={<Main />} />
        <Route path="/verses" element={<Verses />} />
        <Route path="/verses/:network" element={<Verses />} />
        <Route path="/verses/:network/:nameOrAddress" element={<Main />} />

        <Route path="/verses/:network/:nameOrAddress/*" element={<Verse />}>
          {/* <Route index element={<p>no page</p>} /> */}
          <Route path="faculties" element={<Subnets />} />
          <Route path="faculties/:id/*" element={<Subnet />} />

          <Route path="mentors" element={<Delegates />} />
          <Route path="mentors/:id" element={<Delegate />} />

          <Route path="learners/my" element={<MyStake />} />
        </Route>

        <Route path="/sigma" element={<Sigma />} />

        <Route path="/faculties/*" element={<Redirect />} />
        <Route path="/mentors" element={<Redirect />} />
        <Route path="/mentors/my" element={<Redirect />} />
        <Route path="/learners/my" element={<Redirect />} />
      </Route>

      <Route path="*" element={<p>shouldnt be here</p>} />
    </Routes>
  );
}

export default Cybernet;
