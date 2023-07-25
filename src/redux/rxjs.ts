import { map, from, Observable, distinctUntilChanged, filter } from 'rxjs';
import { Citizenship } from 'src/types/citizenship';
import { Nullable } from 'src/types';
import scriptEngine from 'src/services/scripting/engine';
import { keyValuesToObject } from 'src/utils/localStorage';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';

import store, { RootState } from './store';

function select<T>(
  state$: Observable<RootState>,
  mapFn: (state: RootState) => T
): Observable<T> {
  return state$.pipe(map(mapFn), distinctUntilChanged());
}

const initRxStore = () => {
  // create observable from redux store
  const state$ = from(store);

  state$
    .pipe(
      map((state) => selectCurrentPassport(state)),
      filter((r) => !r?.loading && !!r?.data),
      map((r) => r?.data),
      distinctUntilChanged()
    )
    .subscribe((passport: Nullable<Citizenship>) => {
      if (passport) {
        scriptEngine.pushContext({
          user: {
            address: passport.owner,
            nickname: passport.extension.nickname,
            passport,
            particle: passport.extension.particle,
          },
        });
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
