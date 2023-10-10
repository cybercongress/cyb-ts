// import { combineReducers } from 'redux';

import golReducer from './gol';
import bandwidthReducer from './bandwidth';
import pocketReducer from '../features/pocket';
import currentAccountReducer from '../features/currentAccount';
import passportsReducer from '../../features/passport/passports.redux';
import backendReducer from './backend';

const rootReducer = {
  gol: golReducer,
  bandwidth: bandwidthReducer,
  pocket: pocketReducer,
  passports: passportsReducer,
  currentAccount: currentAccountReducer,
  backend: backendReducer,
};

export default rootReducer;
