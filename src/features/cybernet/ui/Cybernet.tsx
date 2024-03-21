import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Main from './pages/Main/Main';
import Subnet from './pages/Subnet/Subnet';
import Delegates from './pages/Delegates/Delegates';
import Delegator from './pages/Delegator/Delegator';
import Subnets from './pages/Subnets/Subnets';
import MyDelegation from './pages/MyDelegation/MyDelegation';
import { Helmet } from 'react-helmet';

function Cybernet() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <Helmet>
              <title>cyb: cybernet</title>
            </Helmet>
            <Outlet />
          </div>
        }
      >
        <Route index element={<Main />} />

        <Route path="subnets" element={<Subnets />} />
        <Route path="subnets/:id" element={<Subnet />} />

        <Route path="delegators" element={<Delegates />} />
        <Route path="delegators/:id" element={<Delegator />} />

        <Route path="staking/my" element={<MyDelegation />} />
      </Route>
    </Routes>
  );
}

export default Cybernet;
