/* eslint-disable import/prefer-default-export */
import {
  distinctUntilChanged,
  filter,
  Observable,
  share,
  switchMap,
  tap,
} from 'rxjs';

export const withInitializerObserver = (
  isInitialized$: Observable<any>,
  actionObservable$: Observable<any>,
  onChange?: (isInitialized: boolean) => void
) =>
  isInitialized$.pipe(
    distinctUntilChanged(),
    filter((initialized) => initialized),
    tap((isInitialized) => onChange?.(isInitialized)),
    switchMap(() => actionObservable$),
    share()
  );
