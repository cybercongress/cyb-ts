import React, { useEffect, useState } from 'react';
import { Route, Router, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import { setTypeDevice } from './redux/actions/settings';
import App from './containers/application/application';
import SearchResults from './containers/Search/SearchResults';
import Gift from './containers/gift';
import Funding from './containers/funding/index';
import Wallet from './containers/Wallet/Wallet';
import Brain from './containers/brain/brain';
import Home from './containers/home/home';
import Governance from './containers/governance/governance';
import ProposalsDetail from './containers/governance/proposalsDetail';
import Validators from './containers/Validators/Validators';
import Story from './containers/story/story';
import GOL from './containers/gol/gol';
import TxsDetails from './containers/txs/txsDetails';
import AccountDetails from './containers/account';
import ValidatorsDetails from './containers/validator';
import Vesting from './containers/vesting/vesting';
import Ipfs from './containers/ipfs/ipfs';
import { Dots, Timer } from './components';
import { initIpfs, setIpfsStatus, setIpfsID } from './redux/actions/ipfs';
import { setBlock } from './redux/actions/block';
import BlockDetails from './containers/blok/blockDetails';
import Txs from './containers/txs';
import Block from './containers/blok';
import ParamNetwork from './containers/parameters';
import Evangelism from './containers/evangelism';
import Got from './containers/got/got';
import TrollBoxx from './containers/trollBox';
import useIpfsStart from './ipfsHook';
import ForceGraph from './containers/forceGraph/forceGraph';
import ForceQuitter from './containers/forceGraph/forceQuitter';
import PortPages from './containers/port';
import TestKeplr from './containers/testKeplre';
import Mint from './containers/mint';
import RoutedEnergy from './containers/energy';
import Bootcycle from './containers/bootcycle';
import Market from './containers/market';
import Oracle from './containers/oracle';
import Objects from './containers/Objects';
import Taverna from './containers/taverna';
import Teleport from './containers/teleport';
import Nebula from './containers/nebula';
import Genesis from './containers/genesis';

import useIpfsFactory from './useIpfsFactory';

import { TIME_START, CYBER } from './utils/config';

export const history = createBrowserHistory({});

function AppRouter({
  initIpfsProps,
  setIpfsStatusProps,
  setTypeDeviceProps,
  setIpfsIDProps,
}) {
  // const dataIpfsStart = useIpfsFactory();
  const dataIpfsStart = useIpfsStart();
  const [loader, setLoader] = useState(true);
  const [time, setTime] = useState(false);
  const [genesis, setGenesis] = useState(false);
  const [wsClient, setWsClient] = useState(null);

  // Qmdab25Rt2irn9aEQCVCJUCSB9aabit7cwghNgYJhiKeth

  useEffect(() => {
    initIpfsProps(dataIpfsStart.node);
    setIpfsStatusProps(dataIpfsStart.status);
    setTypeDeviceProps(dataIpfsStart.mobile);
    setIpfsIDProps(dataIpfsStart.id);
    // setLoader(dataIpfsStart.loader);
  }, [dataIpfsStart]);

  // eslint-disable-next-line no-lone-blocks
  {
    /*  // useEffect(() => {
  //   initClock();
  // }, []);

  // useEffect(() => {
  //   if (blockProps >= 6 && genesis) {
  //     history.push('/episode-1');
  //     setGenesis(false);
  //   }
  // }, [blockProps, genesis]);

  // useEffect(() => {
  //   let ws = null;
  //   const closeHandler = () => {
  //     console.log(`close WS`);
  //     setTimeout(createConnect, 3000);
  //   };

  //   const createConnect = () => {
  //     if (ws !== null) {
  //       ws.removeEventListener('close', closeHandler);
  //     }
  //     ws = new WebSocket(CYBER.CYBER_WEBSOCKET_URL);
  //     ws.addEventListener('close', closeHandler);
  //     console.log(`open`);
  //     setWsClient(ws);
  //   };
  //   createConnect();

  //   return () => {
  //     ws.removeEventListener('close', closeHandler);
  //     ws.close();
  //   };
  // }, []);

  // useEffect(() => {
  //   const handlerOpen = () => {
  //     wsClient.send(
  //       JSON.stringify({
  //         method: 'subscribe',
  //         params: ["tm.event='NewBlockHeader'"],
  //         id: '1',
  //         jsonrpc: '2.0',
  //       })
  //     );
  //   };

  //   if (wsClient !== null) {
  //     wsClient.addEventListener('open', handlerOpen);
  //   }

  //   return () => {
  //     if (wsClient !== null) {
  //       wsClient.removeEventListener('close', handlerOpen);
  //     }
  //   };
  // }, [wsClient]);

  // useEffect(() => {
  //   const handlerMessage = (evt) => {
  //     const message = JSON.parse(evt.data);
  //     if (Object.keys(message.result).length > 0) {
  //       const block = message.result.data.value.header.height;
  //       setBlockProps(block);
  //     }
  //   };

  //   if (wsClient !== null) {
  //     wsClient.addEventListener('message', handlerMessage);
  //   }

  //   return () => {
  //     if (wsClient !== null) {
  //       wsClient.removeEventListener('message', handlerMessage);
  //     }
  //   };
  // }, [wsClient]);

  // const initClock = () => {
  //   const deadline = TIME_START;
  //   const startTime = Date.parse(deadline) - Date.parse(new Date());
  //   if (startTime <= 0) {
  //     setTime(false);
  //   } else {
  //     setTime(true);
  //     setGenesis(true);
  //   }
  // };

  // // add Switch to Router

  // if (time && genesis) {
  //   return (
  //     <div
  //       style={{
  //         width: '100%',
  //         height: '100vh',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         flexDirection: 'column',
  //       }}
  //     >
  //       <div className="countdown-time text-glich" data-text="Start">
  //         Start
  //       </div>
  //       <Timer startTime={TIME_START} updateFunc={initClock} />
  //     </div>
  //   );
  // }

  // if (blockProps < 6 && genesis) {
  //   return (
  //     <div
  //       style={{
  //         width: '100%',
  //         height: '100vh',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         flexDirection: 'row',
  //       }}
  //     >
  //       <div className="countdown-time text-glich" data-text="Block:">
  //         Block:
  //       </div>
  //       <div className="countdown-time text-glich" data-text={blockProps}>
  //         {blockProps}
  //       </div>
  //     </div>
  //   );
  // }
*/
  }

  return (
    <Router history={history}>
      <Route path="/" component={App} />
      <Switch>
        <Route path="/" exact component={Wallet} />
        <Route path="/superintelligence" component={Home} />
        <Route exact path="/search/:query" component={SearchResults} />
        <Route path="/gift/:address?" component={Gift} />
        <Route path="/gol/takeoff" component={Funding} />
        <Route path="/tot" component={Got} />
        <Route path="/brain" component={Brain} />
        <Route exact path="/senate" component={Governance} />
        <Route path="/senate/:proposalId" component={ProposalsDetail} />
        <Route path="/halloffame" component={Validators} />
        <Route path="/episode-1" component={Story} />
        <Route exact path="/network/bostrom/tx" component={Txs} />
        <Route path="/gol" component={GOL} />
        <Route path="/network/bostrom/tx/:txHash" component={TxsDetails} />
        <Route
          path="/network/bostrom/contract/:address"
          component={AccountDetails}
        />
        <Route
          path="/network/bostrom/hero/:address"
          component={ValidatorsDetails}
        />
        <Route path="/quitter" component={ForceQuitter} />
        <Route path="/graph" component={ForceGraph} />
        <Route path="/pgraph/:agent" component={ForceGraph} />
        <Route path="/gol/vesting" component={Vesting} />
        <Route path="/ipfs/:cid" component={Ipfs} />
        <Route exact path="/network/bostrom/block" component={Block} />
        <Route
          path="/network/bostrom/block/:idBlock"
          component={BlockDetails}
        />
        <Route path="/network/bostrom/parameters" component={ParamNetwork} />
        <Route path="/evangelism" component={Evangelism} />
        <Route path="/degenbox" component={TrollBoxx} />
        <Route path="/portal" component={PortPages} />
        <Route path="/test" component={TestKeplr} />
        <Route path="/mint" component={Mint} />
        <Route path="/grid" component={RoutedEnergy} />
        {/* <Route path="/bootcycle" component={Bootcycle} /> */}
        <Route path="/token" component={Market} />
        <Route path="/oracle" component={Oracle} />
        <Route path="/particles" component={Objects} />
        <Route path="/sixthSense" component={Taverna} />
        <Route path="/teleport" component={Teleport} />
        <Route path="/nebula" component={Nebula} />
        <Route path="/genesis" component={Genesis} />
      </Switch>
    </Router>
  );
}

const mapDispatchprops = (dispatch) => {
  return {
    initIpfsProps: (ipfsNode) => dispatch(initIpfs(ipfsNode)),
    setIpfsStatusProps: (status) => dispatch(setIpfsStatus(status)),
    setTypeDeviceProps: (type) => dispatch(setTypeDevice(type)),
    setIpfsIDProps: (id) => dispatch(setIpfsID(id)),
  };
};

export default connect(null, mapDispatchprops)(AppRouter);
