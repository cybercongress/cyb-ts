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
  retry,
  delay,
} from 'rxjs';

export const createLoopObservable = (
  intervalMs: number,
  isInitialized$: Observable<boolean>,
  actionObservable$: Observable<any>,
  beforeCallback?: () => void,
  warmupMs = 0 // Start immediately
) => {
  console.log('---create loop', warmupMs, intervalMs);
  const source$ = isInitialized$.pipe(
    distinctUntilChanged(),
    filter((initialized) => initialized),
    switchMap(() => {
      return interval(intervalMs).pipe(
        startWith(0),
        delay(warmupMs),
        tap(() => beforeCallback && beforeCallback()),
        concatMap(() =>
          actionObservable$.pipe(
            catchError((error) => {
              console.error('>>> createLoopObservable error:', error);
              throw error;
            })
          )
        ),
        retry()
      );
    })
  );
  return source$.pipe(share());
};
