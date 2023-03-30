// import { createBrowserHistory } from 'history';
import {
  Link,
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import App from './containers/application/application';
import SearchResults from './containers/Search/SearchResults';
import Wallet from './containers/Wallet/Wallet';
import Home from './containers/home/home';
import Governance from './containers/governance/governance';
import ProposalsDetail from './containers/governance/proposalsDetail';
import Validators from './containers/Validators/Validators';
import Story from './containers/story/story';
import TxsDetails from './containers/txs/txsDetails';
import AccountDetails from './containers/account';
import ValidatorsDetails from './containers/validator';
import Ipfs from './containers/ipfs/ipfs';
import BlockDetails from './containers/blok/blockDetails';
import Txs from './containers/txs';
import Block from './containers/blok';
import ParamNetwork from './containers/parameters';
import TrollBoxx from './containers/trollBox';
import ForceGraph from './containers/forceGraph/forceGraph';
import ForceQuitter from './containers/forceGraph/forceQuitter';
import TestKeplr from './containers/testKeplre';
import Mint from './containers/mint';
import RoutedEnergy from './containers/energy';
import Market from './containers/market';
import Oracle from './containers/oracle';
import Objects from './containers/Objects';
import Taverna from './containers/taverna';
import Teleport from './containers/teleport';
import Nebula from './containers/nebula';
import Movie from './containers/movie';
import PortalCitizenship from './containers/portal';
import PortalGift from './containers/portal/gift';
import Release from './containers/portal/release';
import Temple from './containers/temple';
import IpfsSettings from './containers/ipfsSettings';
import Ibc from './containers/ibc';
import {
  Codes,
  CodePage,
  ContractPage,
  DashboardPage,
} from './containers/wasm';
import Help from './containers/help';
import Assets from './containers/assets';
import MainPartal from './containers/portal/mainPortal';
import {
  ListNetwork,
  CustomNetwork,
  DetailsNetwork,
} from './containers/network';

import Sigma from './containers/sigma';

import { routes } from './routes';

// const history = createBrowserHistory({});

// backward compatibility
const oldLinks = {
  halloffame: '/halloffame',
  halloffameJailed: '/halloffame/jailed',
  mint: '/mint',
};

function PageNotExist() {
  return (
    <div>
      page not exists
      <br />
      <Link to={routes.home.path}>Home</Link>
    </div>
  );
}
function WrappedRouter({ children }) {
  return process.env.IPFS_DEPLOY ? (
    <HashRouter>{children}</HashRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );
}

function MainLayout() {
  return (
    <>
      <App />
      <Outlet />
    </>
  );
}

function AppRouter() {
  return (
    <WrappedRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Temple />} />
          <Route path="/robot" element={<Wallet />} />
          <Route path="/oracle" element={<Home />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/senate" element={<Governance />} />
          <Route path="/senate/:proposalId" element={<ProposalsDetail />} />
          <Route path={oldLinks.halloffameJailed} element={<Validators />} />
          <Route path={oldLinks.halloffame} element={<Validators />} />
          <Route path="/sphere/*" element={<Validators />} />
          <Route path="/episode-1" element={<Story />} />
          <Route path="/quitter" element={<ForceQuitter />} />
          <Route path="/graph" element={<ForceGraph />} />
          <Route path="/pgraph/:agent" element={<ForceGraph />} />
          <Route path="/ipfs" element={<IpfsSettings />} />
          <Route path="/ipfs/:cid" element={<Ipfs />} />

          <Route path="network/bostrom">
            <Route path="tx" element={<Txs />} />
            <Route path="tx/:txHash" element={<TxsDetails />} />
            <Route path="contract/:address" element={<AccountDetails />} />
            <Route path="contract/:address/:tab" element={<AccountDetails />} />
            <Route path="hero/:address/" element={<ValidatorsDetails />} />
            <Route path="hero/:address/:tab" element={<ValidatorsDetails />} />
            <Route path="parameters" element={<ParamNetwork />} />
            <Route path="blocks" element={<Block />} />
            <Route path="blocks/:idBlock" element={<BlockDetails />} />
          </Route>

          <Route path="/degenbox" element={<TrollBoxx />} />
          <Route path="/test" element={<TestKeplr />} />
          <Route path={oldLinks.mint} element={<Mint />} />
          <Route path={routes.hfr.path} element={<Mint />} />
          <Route path="/grid" element={<RoutedEnergy />} />
          <Route path="/token" element={<Market />} />
          <Route path="/oracle" element={<Oracle />} />
          <Route path="/particles" element={<Objects />} />
          <Route path="/sixthSense" element={<Taverna />} />
          <Route path="/teleport" element={<Teleport />} />
          <Route path="/warp" element={<Teleport />} />
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
          <Route path="/assets" element={<Assets />} />
          {/* Sigma */}
          <Route path="/sigma" element={<Sigma />} />
          <Route path="/nebula" element={<Nebula />} />
          <Route path="*" element={<PageNotExist />} />
        </Route>
      </Routes>
    </WrappedRouter>
  );
}

export default AppRouter;
