import { combineReducers } from 'redux';
import ipfsReducer from './ipfs';
import golReducer from './gol';
import blockReducer from './block';
import bandwidthReducer from './bandwidth';
import accountReducer from './account';

const rootReducer = combineReducers({
  ipfs: ipfsReducer,
  gol: golReducer,
  block: blockReducer,
  bandwidth: bandwidthReducer,
  account: accountReducer,
});

export default rootReducer;
