import {
  Observable,
  combineLatest,
  defer,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs';

import {
  SyncCommunityResult,
  fetchStoredSyncCommunity$,
} from 'src/services/community/community';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { CommunityDto } from 'src/services/CozoDb/types/dto';
import { ServiceDeps } from '../types';

// eslint-disable-next-line import/no-unused-modules
export default function createCommunitySync$(
  deps: ServiceDeps
): Observable<CommunityDto[]> {
  const { dbInstance$, ipfsInstance$, params$, waitForParticleResolve$ } = deps;
  const channel = new BroadcastChannelSender();

  return combineLatest([
    dbInstance$,
    params$!.pipe(
      map((params) => params.myAddress),
      distinctUntilChanged()
    ),
    waitForParticleResolve$,
    ipfsInstance$,
  ]).pipe(
    filter(
      ([dbInstance, myAddress, waitForParticleResolve, ipfsInstance]) =>
        !!dbInstance &&
        !!ipfsInstance &&
        !!myAddress &&
        !!waitForParticleResolve$
    ),
    switchMap(([dbApi, myAddress, waitForParticleResolve, ipfsInstance]) => {
      let community: CommunityDto[] = []; // Fix: Add type declaration for community array
      return new Observable<CommunityDto[]>((observer) => {
        observer.next([]);

        fetchStoredSyncCommunity$(
          dbApi!,
          myAddress!,
          waitForParticleResolve!
        ).subscribe(({ action, items }: SyncCommunityResult) => {
          channel.post({ type: 'load_community', value: { action, items } });

          if (action === 'reset') {
            community = [];
          } else if (['add', 'complete'].some((s) => s === action)) {
            community.push(...items);
          }

          if (action === 'complete') {
            observer.next(community);
            observer.complete();
          }
        });
      });
    })
  );
}
