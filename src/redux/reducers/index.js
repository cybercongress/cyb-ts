import { combineReducers } from 'redux';

import golReducer from './gol';
import blockReducer from './block';
import bandwidthReducer from './bandwidth';
import queryReducer from './query';
import settingsReducer from './settings';
import pocketReducer from './pocket';

const rootReducer = combineReducers({
  gol: golReducer,
  block: blockReducer,
  bandwidth: bandwidthReducer,
  query: queryReducer,
  settings: settingsReducer,
  pocket: pocketReducer,
});

export default rootReducer;
