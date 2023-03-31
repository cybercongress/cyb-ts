import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore(
  {
    reducer: rootReducer,
  }
  // composeWithDevTools(applyMiddleware(thunk))
);

export default store;
