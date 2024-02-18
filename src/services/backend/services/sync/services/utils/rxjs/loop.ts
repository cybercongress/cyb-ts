/* eslint-disable import/prefer-default-export */
import {
  Observable,
  switchMap,
  interval,
  startWith,
  tap,
  retry,
  delay,
  exhaustMap,
  Subject,
} from 'rxjs';
import { withInitializerObserver } from './withInitializer';

type LoopObservableOptions = {
  warmupMs?: number;
  retryDelayMs?: number;
  onStartInterval?: () => void;
  onError?: (error: any) => void;
  intervalMs?: number;
};

export const createLoopObservable = (
  isInitialized$: Observable<boolean>,
  actionObservable$: Observable<any>,
  options: LoopObservableOptions = {}
) => {
  const {
    intervalMs,
    warmupMs = 0,
    onStartInterval,
    onError,
    retryDelayMs = 0,
  } = options;

  const restartTrigger$ = new Subject<void>();

  const intervalOrRestart$ = restartTrigger$.pipe(
    startWith(null),
    switchMap(() => interval(intervalMs).pipe(startWith(0), delay(warmupMs)))
  );

  const source$ = withInitializerObserver(
    isInitialized$,
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
