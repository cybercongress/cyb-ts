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
import Chat from '../Chat/Chat';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { CONTRACT_ADDRESS_PASSPORT } from 'src/containers/portal/utils';
import { Citizenship } from 'src/types/citizenship';
import React from 'react';

const RobotContext = React.createContext<{
  passport: Citizenship | null;
  address: undefined | string;
}>({
  passport: null,
  address: null,
});

export const useRobotContext = () => React.useContext(RobotContext);

function IndexCheck() {
  // const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  // const address = defaultAccount.account?.cyber?.bech32;

  return <Sigma />;
}

function Robot() {
  const params = useParams();
  const queryClient = useQueryClient();

  const [passport, setPassport] = useState({});
  const { username, address } = params;

  useEffect(() => {
    const nickname =
      username?.includes('@') && username.substring(1, username.length);

    if (!queryClient) {
      return;
    }

    let query = {};

    if (address) {
      query = {
        active_passport: {
          address,
        },
      };
    } else if (nickname) {
      query = {
        passport_by_nickname: {
          nickname,
        },
      };
    }

    (async () => {
      try {
        const response = (await queryClient.queryContractSmart(
          CONTRACT_ADDRESS_PASSPORT,
          query
        )) as Citizenship;

        setPassport(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [username, address, queryClient]);

  console.log(address, passport);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RobotContext.Provider
            value={useMemo(
              () => ({
                passport,
                address: address || passport.owner || null,
              }),
              [address, passport]
            )}
          >
            <Layout />
          </RobotContext.Provider>
        }
      >
        <Route index element={<IndexCheck />} />
        {/* <Route path="passport" element={<Navigate to="../" />} /> */}
        <Route path="drive" element={<IpfsSettings />} />
        <Route path="security" element={<Heroes />} />
        <Route path="chat" element={<Chat />} />
        <Route path="timeline" element={<TxsTable />} />

        {/* <Route path="sigma" element={<Sigma />} /> */}
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

        <Route path="*" element={<p>Page should not exist</p>} />
      </Route>
    </Routes>
  );
}

export default Robot;
