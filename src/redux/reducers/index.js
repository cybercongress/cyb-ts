import { combineReducers } from 'redux';
import ipfsReducer from './ipfs';
import golReducer from './gol';
import blockReducer from './block';
import bandwidthReducer from './bandwidth';

const rootReducer = combineReducers({
  ipfs: ipfsReducer,
  gol: golReducer,
  block: blockReducer,
  bandwidth: bandwidthReducer,
});

export default rootReducer;
