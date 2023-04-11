import { combineReducers } from 'redux';

import golReducer from './gol';
import bandwidthReducer from './bandwidth';
import settingsReducer from './settings';
import pocketReducer from './pocket';

const rootReducer = combineReducers({
  gol: golReducer,
  bandwidth: bandwidthReducer,
  settings: settingsReducer,
  pocket: pocketReducer,
});

export default rootReducer;
