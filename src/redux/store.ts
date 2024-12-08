import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
});

// **Declared global Window interface**
declare global {
  interface Window {
    store: typeof store;
  }
}

window.store = store;

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// good for debug
window.store = store;

export default store;