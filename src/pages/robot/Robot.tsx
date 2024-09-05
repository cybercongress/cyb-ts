import { Navigate, Route, Routes } from 'react-router-dom';
import TxsTable from 'src/pages/robot/_refactor/account/component/txsTable';
import Sigma from 'src/containers/sigma';
import RoutedEnergy from 'src/containers/energy';
import TableDiscipline from 'src/containers/gol/table';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import { routes } from 'src/routes';
import IpfsSettings from 'src/features/ipfs/ipfsSettings';
import Audio from 'src/pages/Settings/Audio/Audio';
import Layout from './Layout/Layout';
import RobotContextProvider, { useRobotContext } from './robot.context';
import Brain from './Brain/Brain';
import SensePage from './SensePage';
import LayoutRoot from './Layout/LayoutRoot/Layout';
import ZeroUser from './ZeroUser/ZeroUser';
import FeedsTab from './_refactor/account/tabs/feeds/feeds';
import UnderConstruction from './UnderConstruction/UnderConstruction';
import Heroes from './_refactor/account/tabs/heroes';
import Karma from './Karma/Karma';
import Follows from './_refactor/account/tabs/Follows/Follows';
import Soul from './Soul/Soul';
import Keys from '../Keys/Keys';
import Tokens from '../Hub/containers/Tokens/Tokens';
import Networks from '../Hub/containers/Networks/Networks';
import Channels from '../Hub/containers/Channels/Channels';

function RobotRoutes() {
  const { isLoading, address } = useRobotContext();

  const newUser = !isLoading && !address;

  useAdviserTexts({
    defaultText: `${!newUser ? 'my' : 'welcome to'} robot`,
  });

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {newUser ? (
          <>
            <Route index element={<ZeroUser />} />
            <Route path="*" element={<Navigate to="/robot" />} />
          </>
        ) : (
          <Route element={<LayoutRoot />}>
            <Route index element={<FeedsTab />} />
            <Route path="soul" element={<Soul />} />

            {/* energy */}
            <Route
              path="/grid"
              element={<Navigate to={routes.robot.routes.energy.path} />}
            />
            {['energy', 'energy/:pageId'].map((path) => (
              <Route key={path} path={path} element={<RoutedEnergy />} />
            ))}

            <Route path="swarm" element={<Follows />} />
            <Route path="security" element={<Heroes />} />
            <Route path="rights" element={<UnderConstruction />} />
            <Route path="karma" element={<Karma />} />
            <Route path="badges" element={<TableDiscipline />} />
          </Route>
        )}

        <Route path="sigma" element={<Sigma />} />
        <Route path="time" element={<TxsTable />} />

        {['sense', 'sense/:senseId'].map((path) => (
          <Route key={path} path={path} element={<SensePage />} />
        ))}

        <Route path="audio" element={<Audio />} />
        <Route path="drive" element={<IpfsSettings />} />

        <Route path="keys" element={<Keys />} />
        {/* 
        {['tokens', 'networks', 'channels'].map((path) => (
          <Route key={path} path={`/${path}`} element={<Hub />} />
        ))} */}
        <Route path="tokens" element={<Tokens />} />
        <Route path="networks" element={<Networks />} />
        <Route path="channels" element={<Channels />} />

        <Route path="brain/*" element={<Brain />} />

        <Route path="*" element={<p>Page should not exist</p>} />
      </Route>
    </Routes>
  );
}

function Robot() {
  return (
    <RobotContextProvider>
      <RobotRoutes />
    </RobotContextProvider>
  );
}

export default Robot;
