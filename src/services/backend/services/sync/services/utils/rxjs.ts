/* eslint-disable import/prefer-default-export */
import {
  Observable,
  switchMap,
  interval,
  startWith,
  tap,
  concatMap,
  catchError,
  share,
  distinctUntilChanged,
  filter,
} from 'rxjs';

export const createLoopObservable = (
  intervalMs: number,
  isInitialized$: Observable<boolean>,
  actionObservable$: Observable<any>,
  beforeCallback?: () => void,
  warmupMs = 0 // Start immediately
) => {
  const source$ = isInitialized$.pipe(
    distinctUntilChanged(),
    filter((initialized) => initialized),
    switchMap(() => {
      return interval(intervalMs).pipe(
        startWith(warmupMs),
        tap(() => beforeCallback && beforeCallback()),
        concatMap(() =>
          actionObservable$.pipe(
            catchError((error) => {
              console.log('Error:', error);
              throw error;
            })
          )
        )
      );
    })
  );
  return source$.pipe(share());
};
