import {
  combineLatest,
  map,
  from,
  Observable,
  distinctUntilChanged,
} from 'rxjs';
import { Citizenship } from 'src/types/citizenship';
import { Nullable } from 'src/types';
import scriptEngine from 'src/services/scripting/engine';
import { keyValuesToObject } from 'src/utils/localStorage';

import store, { RootState } from './store';
import { setContext } from './features/scripting';

function select<T>(
  state$: Observable<RootState>,
  mapFn: (state: RootState) => T
): Observable<T> {
  return state$.pipe(map(mapFn), distinctUntilChanged());
}

const initRxStore = () => {
  const state$ = from(store);

  const passport$ = state$.pipe(
    map((state) => state.passports),
    distinctUntilChanged()
  );

  const defaultAccount$ = state$.pipe(
    map((state) => state.pocket.defaultAccount),
    distinctUntilChanged()
  );

  // Combine data to get passport based user info/citizenship
  combineLatest([passport$, defaultAccount$])
    .pipe(
      map(([passports, defaultAccount]) => {
        const address = defaultAccount.account?.cyber.bech32;
        if (
          !address ||
          passports[address]?.loading ||
          !passports[address]?.data
        ) {
          return undefined;
        }

        return passports[address]?.data;
      }),
      distinctUntilChanged()
    )
    .subscribe((passport: Nullable<Citizenship>) => {
      if (passport) {
        store.dispatch(
          setContext({
            name: 'user',
            item: {
              address: passport.owner,
              nickname: passport.extension.nickname,
              passport,
              particle: passport.extension.particle,
            },
          })
        );
      }
    });

  // Secrets
  select(state$, (state: RootState) => state.scripting.secrets).subscribe(
    (secrets) => {
      scriptEngine.setContext({
        secrets: keyValuesToObject(Object.values(secrets)),
      });
    }
  );

  // Context
  select(state$, (state: RootState) => state.scripting.context).subscribe(
    (context) => {
      scriptEngine.setContext(context);
    }
  );

  // Script entrypoint code
  select(
    state$,
    (state: RootState) => state.scripting.scripts.entrypoints
  ).subscribe((entrypoints) => {
    scriptEngine.setEntrypoints(entrypoints);
  });
};

export default initRxStore;
