import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
});
// composeWithDevTools(applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// good for debug
window.store = store;

export default store;
