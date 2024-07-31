import {
  TransferHandler,
  Remote,
  proxy,
  releaseProxy,
  transferHandlers,
} from 'comlink';
import { Observer } from 'redux';

import { Observable, Subscribable, Subscription } from 'rxjs';

export const ObservableHandler: TransferHandler<unknown, MessagePort> = {
  canHandle: (value: unknown): value is Observable<unknown> => {
    return value instanceof Observable;
  },
  deserialize: (value: MessagePort) => {
    return new Observable<unknown>((observer) => {
      const remote = transferHandlers
        .get('proxy')!
        .deserialize(value) as Remote<Subscribable<unknown>>;

      remote
        .subscribe(
          proxy({
            next: (next: unknown) => observer.next(next),
            error: (error: unknown) => observer.error(error),
            complete: () => observer.complete(),
          })
        )
        .then((subscription) =>
          observer.add(() => {
            subscription.unsubscribe();
            remote[releaseProxy]();
          })
        );
    });
  },
  serialize: (value: Observable<unknown>) => {
    return transferHandlers.get('proxy')!.serialize({
      subscribe: (observer: Remote<Observer<unknown>>) =>
        value.subscribe({
          next: (next: unknown) => observer.next(next).then(),
          error: (error: unknown) => observer.error(error).then(),
          complete: () => observer.complete().then(),
        }),
    });
  },
};

export const SubscriptionHandler: TransferHandler<unknown, unknown> = {
  canHandle: (value: unknown): value is Subscription => {
    return value instanceof Subscription;
  },
  deserialize: (value: MessagePort) => {
    return new Subscription(() => {
      const remote = transferHandlers
        .get('proxy')!
        .deserialize(value) as Remote<Subscription>;

      remote.unsubscribe().then(() => {
        remote[releaseProxy]();
      });
    });
  },
  serialize: (value: Subscription) => {
    return transferHandlers.get('proxy')!.serialize({
      unsubscribe: () => value.unsubscribe(),
    });
  },
};
