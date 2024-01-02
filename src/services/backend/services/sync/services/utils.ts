import {
  Observable,
  switchMap,
  interval,
  startWith,
  tap,
  concatMap,
  EMPTY,
  distinctUntilChanged,
  share,
} from 'rxjs';

export const createLoopObservable = (
  intervalMs: number,
  isInitialized$: Observable<boolean>,
  actionObservable$: Observable<any>,
  beforeCallback?: () => void
) => {
  const source$ = isInitialized$.pipe(
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
  return source$.pipe(share()); // Use the share operator to multicast the source observable
};
