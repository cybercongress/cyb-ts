import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Main from './pages/Main/Main';
import Subnet from './pages/Subnet/Subnet';
import Delegates from './pages/Delegates/Delegates';
import Delegate from './pages/Delegate/Delegate';
import Subnets from './pages/Subnets/Subnets';
import MyStake from './pages/MyStake/MyStake';
import { Helmet } from 'react-helmet';
import CybernetProvider from './cybernet.context';
import Verses from './pages/Verses/Verses';

function Cybernet() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <CybernetProvider>
              <Helmet>
                <title>cybernet | cyb</title>
              </Helmet>
              <Outlet />
            </CybernetProvider>
          </div>
        }
      >
        <Route index element={<Main />} />
        <Route path="/verses" element={<Verses />} />
        <Route path="/verses/:network" element={<Verses />} />
        <Route path="/verses/:network/:nameOrAddress" element={<Outlet />}>
          {/* <Route index element={<p>no page</p>} /> */}
          <Route path="facilities" element={<Subnets />} />
          <Route path="facilities/:id/*" element={<Subnet />} />

          <Route path="mentors" element={<Delegates />} />
          <Route path="mentors/:id" element={<Delegate />} />

          <Route path="staking/my" element={<MyStake />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Cybernet;
