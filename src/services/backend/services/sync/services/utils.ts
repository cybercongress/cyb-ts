import {
  Observable,
  switchMap,
  interval,
  startWith,
  tap,
  concatMap,
  EMPTY,
} from 'rxjs';

export const createLoopObservable = (
  intervalMs: number,
  actionObservable$: Observable<any>,
  isInitialized$: Observable<boolean>,
  beforeCallback?: () => void
) => {
  return isInitialized$.pipe(
    switchMap((initialized) => {
      if (initialized) {
        // When isInitialized$ emits true, start the interval
        return interval(intervalMs).pipe(
          startWith(0), // Start immediately
          tap(() => beforeCallback && beforeCallback()),
          concatMap(() => actionObservable$)
        );
      }
      return EMPTY;
    })
  );
};
