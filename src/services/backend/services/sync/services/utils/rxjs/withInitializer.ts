/* eslint-disable import/prefer-default-export */
import {
  distinctUntilChanged,
  filter,
  Observable,
  share,
  switchMap,
  take,
  tap,
} from 'rxjs';

export const withInitializerObserver = (
  isInitialized$: Observable<any>,
  actionObservable$: Observable<any>,
  onChange?: (isInitialized: boolean) => void
) =>
  isInitialized$.pipe(
    distinctUntilChanged(),
    tap((isInitialized) => onChange?.(isInitialized)),
    filter((initialized) => initialized),
    switchMap(() => actionObservable$),
    share()
  );
