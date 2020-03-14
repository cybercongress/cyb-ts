import { combineReducers } from 'redux';
import ipfsReducer from './ipfs';

const rootReducer = combineReducers({
  ipfs: ipfsReducer,
});

export default rootReducer;
