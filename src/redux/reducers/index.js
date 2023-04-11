import { combineReducers } from 'redux';

import golReducer from './gol';
import blockReducer from './block';
import bandwidthReducer from './bandwidth';
import pocketReducer from './pocket';

const rootReducer = combineReducers({
  gol: golReducer,
  block: blockReducer,
  bandwidth: bandwidthReducer,
  pocket: pocketReducer,
});

export default rootReducer;
