import { combineReducers } from 'redux';
import ipfsReducer from './ipfs';
import golReducer from './gol';

const rootReducer = combineReducers({
  ipfs: ipfsReducer,
  gol: golReducer,
});

export default rootReducer;
