import {
  ofType,
  combineEpics,
  StateObservable,
  ActionsObservable,
} from 'redux-observable';
import {
  Observable,
  tap,
  map,
  withLatestFrom,
  switchMap,
  filter,
  distinctUntilChanged,
  ignoreElements,
  EMPTY,
} from 'rxjs';
import { Nullable } from 'src/types';

import { WebLLMInstance } from 'src/services/scripting/webLLM';
import scriptEngine from 'src/services/scripting/engine';
import { Citizenship } from 'src/types/citizenship';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import { keyValuesToObject } from 'src/utils/localStorage';

import {
  setChatBotStatus,
  setChatBotLoadProgress,
  setContext,
  ScriptingActionTypes,
} from '../features/scripting';

import type { RootState } from '../store';

type ActionWithPayload<T> = Extract<ScriptingActionTypes, { type: T }>;

const ofScriptingType = ofType<
  ScriptingActionTypes,
  ScriptingActionTypes['type']
>;

const chatBotActiveEpic = (
  action$: ActionsObservable<ScriptingActionTypes>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    // tap((a) => console.log(a)),
    ofScriptingType('scripting/setChatBotActive'),
    withLatestFrom(state$),
    switchMap(
      ([action, state]) =>
        new Observable((observer) => {
          const { name, chatBotList } = state.scripting.chatBot;

          if (action.payload) {
            WebLLMInstance.updateConfig(chatBotList);
            WebLLMInstance.load(name, ({ progress }) =>
              observer.next(setChatBotLoadProgress({ progress }))
            ).then(() => observer.next(setChatBotStatus('on')));
          } else {
            WebLLMInstance.unload();
          }
        })
    )
  );

const selectPassportEpic = (
  action$: ActionsObservable<ScriptingActionTypes>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    withLatestFrom(state$),
    map(([, state]) => selectCurrentPassport(state)),
    filter((r) => !r?.loading && r?.data),
    map((r) => r.data),
    distinctUntilChanged(),
    map((passport: Nullable<Citizenship>) =>
      passport
        ? setContext({
            name: 'user',
            item: {
              address: passport.owner,
              nickname: passport.extension.nickname,
              passport,
              particle: passport.extension.particle,
            },
          })
        : { type: 'passport_not_initialized' }
    )
  );

const scriptingContextEpic = (
  action$: ActionsObservable<ScriptingActionTypes>
) =>
  action$.pipe(
    ofScriptingType('scripting/setContext'),
    map((action: ActionWithPayload<'scripting/setContext'>) => {
      const { name, item } = action.payload;
      scriptEngine.pushContext(name, item);
    }),
    ignoreElements()
  );

const entrypointsEpic = (
  action$: ActionsObservable<ScriptingActionTypes>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofScriptingType('scripting/setScript'),
    withLatestFrom(state$),
    map(([, state]) => {
      console.log('-----setent', state.scripting.scripts.entrypoints);
      scriptEngine.setEntrypoints(state.scripting.scripts.entrypoints);
    }),
    ignoreElements()
  );

export default combineEpics(
  chatBotActiveEpic,
  selectPassportEpic,
  scriptingContextEpic,
  entrypointsEpic
);
