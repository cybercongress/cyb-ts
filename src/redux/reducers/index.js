import { combineReducers } from 'redux';
import ipfsReducer from './ipfs';
import golReducer from './gol';
import blockReducer from './block';

const rootReducer = combineReducers({
  ipfs: ipfsReducer,
  gol: golReducer,
  block: blockReducer,
});

export default rootReducer;
