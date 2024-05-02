// import { combineReducers } from 'redux';

import commanderReducer from 'src/containers/application/Header/Commander/commander.redux';
import scriptingReducer from 'src/redux/reducers/scripting';

import golReducer from './gol';
import bandwidthReducer from './bandwidth';
import pocketReducer from '../features/pocket';
import currentAccountReducer from '../features/currentAccount';
import passportsReducer from '../../features/passport/passports.redux';
import backendReducer from './backend';
import senseReducer from '../../features/sense/redux/sense.redux';
import warpReducer from '../features/warp';
import ibcDenomReducer from '../features/ibcDenom';

const rootReducer = {
  gol: golReducer,
  bandwidth: bandwidthReducer,
  pocket: pocketReducer,
  passports: passportsReducer,
  currentAccount: currentAccountReducer,
  backend: backendReducer,
  commander: commanderReducer,
  sense: senseReducer,
  warp: warpReducer,
  ibcDenom: ibcDenomReducer,
  scripting: scriptingReducer,
};

export default rootReducer;
