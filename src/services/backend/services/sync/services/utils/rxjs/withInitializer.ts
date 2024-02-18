/* eslint-disable import/prefer-default-export */
import {
  distinctUntilChanged,
  filter,
  Observable,
  share,
  switchMap,
} from 'rxjs';

export const withInitializerObserver = (
  isInitialized$: Observable<any>,
  actionObservable$: Observable<any>
) =>
  isInitialized$.pipe(
    distinctUntilChanged(),
    filter((initialized) => initialized),
    switchMap(() => actionObservable$),
    share()
  );
