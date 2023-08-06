import { ofType, combineEpics, StateObservable } from 'redux-observable';

import {
  Observable,
  tap,
  map,
  withLatestFrom,
  switchMap,
  filter,
  distinctUntilChanged,
  ignoreElements,
  from,
  of,
} from 'rxjs';
import { Nullable } from 'src/types';

import { WebLLMInstance } from 'src/services/scripting/webLLM';
import scriptEngine from 'src/services/scripting/engine';
import { queueManager } from 'src/services/QueueManager/QueueManager';
import { Citizenship } from 'src/types/citizenship';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';

import {
  setChatBotStatus,
  setChatBotLoadProgress,
  setEntrypoint,
  setContext,
  ScriptingActionTypes,
} from '../features/scripting';

import type { RootState } from '../store';
import { isCID } from 'src/utils/ipfs/helpers';
import { getScriptFromParticle } from 'src/services/scripting/helpers';

type ActionWithPayload<T> = Extract<ScriptingActionTypes, { type: T }>;

const ofScriptingType = ofType<
  ScriptingActionTypes,
  ScriptingActionTypes['type']
>;

const chatBotActiveEpic = (
  action$: Observable<ScriptingActionTypes>,
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
  action$: Observable<ScriptingActionTypes>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    withLatestFrom(state$),
    map(([, state]) => selectCurrentPassport(state)),
    filter((r) => !r?.loading && r?.data),
    map((r) => r.data),
    distinctUntilChanged(),
    switchMap((passport: Nullable<Citizenship>) => {
      if (passport) {
        setContext({
          name: 'user',
          item: {
            address: passport.owner,
            nickname: passport.extension.nickname,
            passport,
            particle: passport.extension.particle,
          },
        });
        return from(getScriptFromParticle(passport.extension.particle)).pipe(
          map((code) => setEntrypoint({ name: 'particle', code }))
        );
      }
      return of({ type: 'passport_not_initialized' });
    })
  );

const scriptingContextEpic = (action$: Observable<ScriptingActionTypes>) =>
  action$.pipe(
    ofScriptingType('scripting/setContext'),
    map((action: ActionWithPayload<'scripting/setContext'>) => {
      const { name, item } = action.payload;
      scriptEngine.pushContext(name, item);
    }),
    ignoreElements()
  );

const entrypointsEpic = (
  action$: Observable<ScriptingActionTypes>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofScriptingType(
      'scripting/setEntrypoint',
      'scripting/setEntrypointEnabled'
    ),
    withLatestFrom(state$),
    map(([, state]) => {
      console.log('-----scripting upda', state.scripting.scripts.entrypoints);

      scriptEngine.setEntrypoints(state.scripting.scripts.entrypoints);
    }),
    ignoreElements()
  );

const rootEpic = combineEpics(
  chatBotActiveEpic,
  selectPassportEpic,
  scriptingContextEpic,
  entrypointsEpic
);

export default rootEpic;
