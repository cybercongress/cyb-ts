import {
  combineLatest,
  map,
  from,
  Observable,
  distinctUntilChanged,
  filter,
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
  // create observable from redux store
  const state$ = from(store);

  const passport$ = select(state$, (state: RootState) => state.passports);

  const defaultAddress$ = state$.pipe(
    map((state) => state.pocket.defaultAccount.account?.cyber.bech32 || ''),
    filter((defaultAddress) => !!defaultAddress)
  );

  combineLatest([passport$, defaultAddress$])
    .pipe(
      filter(
        ([passports, defaultAddress]) =>
          !passports[defaultAddress]?.loading &&
          !!passports[defaultAddress]?.data
      ),
      map(([passports, defaultAddress]) => passports[defaultAddress]?.data),
      distinctUntilChanged()
    )
    .subscribe((passport: Nullable<Citizenship>) => {
      if (passport) {
        // dispach change inside scripting context

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
      scriptEngine.pushContext({
        secrets: keyValuesToObject(Object.values(secrets)),
      });
    }
  );

  // Context
  select(state$, (state: RootState) => state.scripting.context).subscribe(
    (context) => {
      scriptEngine.pushContext(context);
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
