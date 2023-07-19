// import { combineReducers } from 'redux';

import golReducer from './gol';
import bandwidthReducer from './bandwidth';
import pocketReducer from '../features/pocket';
import scriptingReducer from '../features/scripting';
import currentAccountReducer from '../features/currentAccount';
import passportsReducer from '../../features/passport/passports.redux';

const rootReducer = {
  gol: golReducer,
  bandwidth: bandwidthReducer,
  pocket: pocketReducer,
  scripting: scriptingReducer,
  passports: passportsReducer,
  currentAccount: currentAccountReducer,
};

export default rootReducer;
