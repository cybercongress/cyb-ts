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
  catchError,
} from 'rxjs';
import { CyberLinkSimple } from 'src/types/base';

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
          concatMap((value) =>
            actionObservable$.pipe(
              catchError((error) => {
                console.log('Error:', error);
                throw error;
              })
            )
          )
        );
      }
      return EMPTY;
    })
  );
  return source$.pipe(share()); // Use the share operator to multicast the source observable
};

export const getUniqueParticlesFromLinks = (links: CyberLinkSimple[]) => [
  ...new Set([
    ...links.map((link) => link.to),
    ...links.map((link) => link.from),
  ]),
];
