import { combineReducers } from 'redux';

import golReducer from './gol';
import bandwidthReducer from './bandwidth';
import pocketReducer from '../features/pocket';

const rootReducer = combineReducers({
  gol: golReducer,
  bandwidth: bandwidthReducer,
  pocket: pocketReducer,
});

export default rootReducer;
