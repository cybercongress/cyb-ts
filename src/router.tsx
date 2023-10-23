import {
  Link,
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import App from './containers/application/App';
import Home from './containers/home/home';
import Governance from './containers/governance/governance';
import ProposalsDetail from './containers/governance/proposalsDetail';
import Validators from './containers/Validators/Validators';
import Story from './containers/story/story';
import TxsDetails from './containers/txs/txsDetails';
import ValidatorsDetails from './containers/validator';
import Ipfs from './containers/ipfs/ipfs';
import BlockDetails from './containers/blok/blockDetails';
import Txs from './containers/txs';
import Block from './containers/blok';
import ParamNetwork from './containers/parameters';
import TrollBoxx from './containers/trollBox';
import ForceQuitter from './containers/forceGraph/forceQuitter';
import TestKeplr from './containers/testKeplre';
import Mint from './containers/mint';
import Market from './containers/market';
import Oracle from './containers/oracle';
import Objects from './containers/Objects';
import TeleportTs from './containers/teleport';
import Nebula from './containers/nebula';
import Movie from './containers/movie';
import PortalCitizenship from './containers/portal';
import PortalGift from './containers/portal/gift';
import Release from './containers/portal/release';
import Temple from './containers/temple';
import IpfsSettings from './features/ipfs/ipfsSettings';
import Ibc from './containers/ibc';
import {
  Codes,
  CodePage,
  ContractPage,
  DashboardPage,
} from './containers/wasm';
import Help from './containers/help';
import MainPartal from './containers/portal/mainPortal';
import {
  ListNetwork,
  CustomNetwork,
  DetailsNetwork,
} from './containers/network';

import { routes } from './routes';
import WarpDashboardPools from './containers/warp/WarpDashboardPools';
import Warp from './containers/warp/Warp';
import Robot from './pages/robot/Robot';
import SigmaWrapper from './containers/sigma/SigmaWrapper';
import Keys from './pages/Keys/Keys';
import Search from './pages/Search/Search';
import Learn from './pages/Learn/Learn';
import CyberlinksGraphContainer from './features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';

type WrappedRouterProps = {
  children: React.ReactNode;
};

function WrappedRouter({ children }: WrappedRouterProps) {
  return process.env.IPFS_DEPLOY ? (
    <HashRouter>{children}</HashRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );
}

function PageNotExist() {
  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      page not exists
      <br />
      <Link to={routes.home.path}>Home</Link>
    </div>
  );
}

function CheckPassportPage() {
  const params = useParams();

  if (params.username?.includes('@')) {
    return <Robot />;
  }

  return <PageNotExist />;
}

function ValidatorsRedirect() {
  const { status } = useParams();
  return <Navigate to={`/sphere/${status}`} />;
}

function RedirectToRobot() {
  const params = useParams();
  return <Navigate to={`/neuron/${params.address}`} replace />;
}

function RedirectToRobotBrain() {
  const params = useParams();
  return <Navigate to={`/neuron/${params.agent}/brain`} replace />;
}

function RedirectToOracleAsk() {
  const { query } = useParams();
  return <Navigate to={routes.oracle.ask.getLink(query)} replace />;
}

function AppRouter() {
  return (
    <WrappedRouter>
      <Routes>
        <Route path={routes.home.path} element={<App />}>
          <Route index element={<Search />} />

          <Route path="/robot/*" element={<Robot />} />

          <Route path={routes.temple.path} element={<Temple />} />
          <Route path={routes.neuron.path} element={<Robot />} />
          <Route path={routes.oracle.learn.path} element={<Learn />} />
          <Route path="/oracle/stats" element={<Home />} />
          <Route path="/oracle-old" element={<Oracle />} />

          <Route path="/oracle" element={<Search />} />
          <Route path="/senate" element={<Governance />} />
          <Route
            path={routes.senateProposal.path}
            element={<ProposalsDetail />}
          />

          {/* old links - start */}
          <Route path="/halloffame" element={<Navigate to="/sphere" />} />
          <Route path="/halloffame/:status" element={<ValidatorsRedirect />} />
          <Route path="/mint" element={<Navigate to={routes.hfr.path} />} />
          {/* old links - end */}

          <Route path="/sphere" element={<Validators />} />
          <Route path="/sphere/:status" element={<Validators />} />
          <Route path="/episode-1" element={<Story />} />
          <Route path="/quitter" element={<ForceQuitter />} />

          <Route
            path="/graph"
            element={<CyberlinksGraphContainer toPortal />}
          />
          <Route path="/pgraph/:agent" element={<RedirectToRobotBrain />} />

          <Route path="/ipfs" element={<Navigate to="/robot/drive" />} />
          <Route path="/ipfs/:query" element={<RedirectToOracleAsk />} />
          <Route path={routes.oracle.ask.path} element={<Ipfs />} />

          <Route path="network/bostrom">
            <Route path="tx" element={<Txs />} />
            <Route path="tx/:txHash" element={<TxsDetails />} />

            <Route path="contract/:address" element={<RedirectToRobot />} />
            <Route
              path="contract/:address/:tab"
              element={<RedirectToRobot />}
            />

            <Route path="hero/:address/" element={<ValidatorsDetails />} />
            <Route path="hero/:address/:tab" element={<ValidatorsDetails />} />
            <Route path="parameters" element={<ParamNetwork />} />
            <Route path="parameters/:param" element={<ParamNetwork />} />
            <Route path="blocks" element={<Block />} />
            <Route path="blocks/:idBlock" element={<BlockDetails />} />
          </Route>
          <Route path="/degenbox" element={<TrollBoxx />} />
          <Route path="/test" element={<TestKeplr />} />
          <Route path={routes.hfr.path} element={<Mint />} />
          <Route path="/token" element={<Market />} />
          <Route path="/token/:tab" element={<Market />} />
          <Route path="/particles" element={<Objects />} />
          <Route path="/teleport" element={<TeleportTs />} />
          <Route path="/warp" element={<WarpDashboardPools />} />
          <Route path="/warp/:tab" element={<Warp />} />
          <Route path="/genesis" element={<Movie />} />
          <Route path="/citizenship" element={<PortalCitizenship />} />
          <Route path="/gift" element={<PortalGift />} />
          <Route path="/release" element={<Release />} />
          <Route path="/portal" element={<MainPartal />} />
          <Route path="/ibc" element={<Ibc />} />
          {/* wasm */}
          <Route path="/libs" element={<Codes />} />
          <Route path="/libs/:codeId" element={<CodePage />} />
          <Route path="/contracts" element={<DashboardPage />} />
          <Route
            path="/contracts/:contractAddress"
            element={<ContractPage />}
          />
          {/* network */}
          <Route path="/networks" element={<ListNetwork />} />
          <Route path="/networks/add" element={<CustomNetwork />} />
          <Route path="/networks/:networkId" element={<DetailsNetwork />} />
          <Route path="/help" element={<Help />} />

          <Route path="/sigma" element={<SigmaWrapper />} />

          <Route path="/nebula" element={<Nebula />} />

          <Route path="/keys" element={<Keys />} />

          {/* works as 404 also */}
          <Route path=":username/*" element={<CheckPassportPage />} />
          <Route path="*" element={<PageNotExist />} />
        </Route>
      </Routes>
    </WrappedRouter>
  );
}

export default AppRouter;
