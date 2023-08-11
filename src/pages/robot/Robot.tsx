import { Route, Routes } from 'react-router-dom';
import TxsTable from 'src/pages/robot/_refactor/account/component/txsTable';
import FeedsTab from 'src/pages/robot/_refactor/account/tabs/feeds';
import FollowsTab from 'src/pages/robot/_refactor/account/tabs/follows';
import Heroes from 'src/pages/robot/_refactor/account/tabs/heroes';
import ForceGraph from 'src/containers/forceGraph/forceGraph';
import TableDiscipline from 'src/containers/gol/table';
import IpfsSettings from 'src/features/ipfs/ipfsSettings';
import Sigma from 'src/containers/sigma';
import Taverna from 'src/containers/taverna';
import Layout from './Layout/Layout';
import RoutedEnergy from '../../containers/energy/index';
import UnderConstruction from './UnderConstruction/UnderConstruction';
import ZeroUser from './ZeroUser/ZeroUser';
import RobotContextProvider, { useRobotContext } from './robot.context';
import ScriptEditor from 'src/containers/portal/components/ScriptEditor/ScriptEditor';

function RobotRoutes() {
  const { isOwner, isLoading, address } = useRobotContext();

  const newUser = !isLoading && !address;
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={newUser ? <ZeroUser /> : <Sigma />} />
        <Route path="timeline" element={<TxsTable />} />
        <Route path="chat" element={<UnderConstruction />} />
        <Route path="badges" element={<TableDiscipline />} />
        <Route path="items" element={<UnderConstruction />} />
        <Route path="security" element={<Heroes />} />
        <Route path="skills" element={<UnderConstruction />} />
        <Route path="rights" element={<UnderConstruction />} />

        <Route path="sense" element={<Taverna />} />
        <Route
          path="drive"
          element={isOwner ? <IpfsSettings /> : <UnderConstruction />}
        />
        <Route path="log" element={<FeedsTab />} />
        <Route path="energy/*" element={<RoutedEnergy />} />
        <Route path="swarm" element={<FollowsTab />} />
        <Route path="brain" element={<ForceGraph />} />
        <Route path="karma" element={<UnderConstruction />} />
        <Route path="soul/:tab" element={<ScriptEditor />} />

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
