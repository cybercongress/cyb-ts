import {
  BroadcastChannelMessage,
  getBroadcastChannemMessageKey,
} from '../types/services';
import { CYB_BROADCAST_CHANNEL } from './consts';
import { Subscriber, Observable, Subscription } from 'rxjs';
import { throttleTime, bufferTime } from 'rxjs/operators';
import { AppDispatch } from 'src/redux/store';

class RxBroadcastChannelListener {
  private subscription: Subscription;

  constructor(dispatch: AppDispatch) {
    const messageObservable = new Observable<
      MessageEvent<BroadcastChannelMessage>
    >((subscriber) => {
      const channel = new BroadcastChannel(CYB_BROADCAST_CHANNEL);

      channel.onmessage = (msg: MessageEvent<BroadcastChannelMessage>) => {
        subscriber.next(msg);
      };

      return () => {
        channel.onmessage = null;
      };
    });

    this.subscription = messageObservable
      .pipe(
        bufferTime(2000) // Accumulate messages in a 2-second window
      )
      .subscribe((messages) => {
        if (messages.length > 0) {
          const items = new Map<string, BroadcastChannelMessage>();
          messages.forEach((msg) => {
            const key = getBroadcastChannemMessageKey(msg.data);
            items.set(key, msg.data);
          });
          console.log('Dispatching accumulated messages:', messages);
          items.forEach(dispatch);
        }
      });
  }
  close() {
    this.subscription.unsubscribe();
  }
}

export default RxBroadcastChannelListener;
