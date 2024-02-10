/* eslint-disable import/prefer-default-export */
import {
  Observable,
  switchMap,
  interval,
  startWith,
  tap,
  share,
  distinctUntilChanged,
  filter,
  retry,
  delay,
  exhaustMap,
  Subject,
  EMPTY,
} from 'rxjs';

type LoopObservableOptions = {
  warmupMs?: number;
  retryDelayMs?: number;
  onStartInterval?: () => void;
  onError?: (error: any) => void;
};

export const createLoopObservable = (
  intervalMs: number,
  isInitialized$: Observable<boolean>,
  actionObservable$: Observable<any>,
  options: LoopObservableOptions = {}
) => {
  const { warmupMs = 0, onStartInterval, onError, retryDelayMs = 0 } = options;

  const restartTrigger$ = new Subject<void>();

  const intervalOrRestart$ = restartTrigger$.pipe(
    startWith(null),
    switchMap(() => interval(intervalMs).pipe(startWith(0), delay(warmupMs)))
  );

  const source$ = isInitialized$.pipe(
    distinctUntilChanged(),
    filter((initialized) => initialized),
    switchMap(() =>
      intervalOrRestart$.pipe(
        tap(() => onStartInterval && onStartInterval()),
        exhaustMap(() =>
          actionObservable$.pipe(
            retry({
              delay: (error) => {
                console.log('retry', error);
                onError && onError(error);
                return interval(retryDelayMs);
              },
            })
          )
        )
      )
    ),
    share()
  );

  return {
    loop$: source$,
    restartLoop: () => {
      // console.log('>>> createLoopObservable restart');
      // Trigger a restart by emitting a new value
      restartTrigger$.next();
    },
  };
};
