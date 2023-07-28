import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import scriptingEpic from './epics/ScriptingEpic';

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
});
// composeWithDevTools(applyMiddleware(thunk))

epicMiddleware.run(scriptingEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

window.store = store;

export default store;
