import ipfsReducer from './ipfs';
import golReducer from './gol';
import blockReducer from './block';
import bandwidthReducer from './bandwidth';
import accountReducer from './account';
import queryReducer from './query';
import settingsReducer from './settings';
import pocketReducer from './pocket';

const rootReducer = {
  ipfs: ipfsReducer,
  gol: golReducer,
  block: blockReducer,
  bandwidth: bandwidthReducer,
  account: accountReducer,
  query: queryReducer,
  settings: settingsReducer,
  pocket: pocketReducer,
};

export default rootReducer;
