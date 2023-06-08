import { combineReducers } from 'redux';

import golReducer from './gol';
import bandwidthReducer from './bandwidth';
import pocketReducer from '../features/pocket';
import passportReducer from '../features/passport';

const rootReducer = combineReducers({
  gol: golReducer,
  bandwidth: bandwidthReducer,
  pocket: pocketReducer,
  passport: passportReducer,
});

export default rootReducer;
