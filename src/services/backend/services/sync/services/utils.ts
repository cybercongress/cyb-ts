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
import { CyberLinkSimple, NeuronAddress } from 'src/types/base';
import {
  MSG_MULTI_SEND_TRANSACTION_TYPE,
  MSG_SEND_TRANSACTION_TYPE,
  MsgMultiSendTransaction,
  MsgSendTransaction,
  Coin,
} from '../../dataSource/blockchain/types';
import { SenseChat, SenseChatMessage } from '../types';
import { TransactionDto } from 'src/services/CozoDb/types/dto';

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

const updateChat = (
  chats: Map<NeuronAddress, SenseChat>,
  addr: string,
  t: TransactionDto,
  amount: Coin[]
): Map<string, SenseChat> => {
  const transactions = chats.has(addr)
    ? chats.get(addr)?.transactions || []
    : [];

  transactions.push(t);
  console.log('---updateChat', addr, t, amount);
  chats.set(addr, {
    userAddress: addr,
    last: { amount, memo: t.memo },
    transactions,
  });
  return chats;
};

// eslint-disable-next-line import/no-unused-modules
export const extractSenseChats = (
  myAddress: NeuronAddress,
  transactions: TransactionDto[]
) => {
  const chats = new Map<NeuronAddress, SenseChat>();
  transactions.forEach((t) => {
    let userAddress = '';
    if (t.type === MSG_MULTI_SEND_TRANSACTION_TYPE) {
      // TODO: How to deal many outputs vs many inputs??
      const { inputs, outputs } = t.value;
      const userMessages = inputs.find((i) => i.address === myAddress)
        ? outputs
        : inputs;
      userMessages.forEach((msg) =>
        updateChat(chats, msg.address, t, msg.coins)
      );
    } else if (t.type === MSG_SEND_TRANSACTION_TYPE) {
      const { from_address, to_address, amount } =
        t.value as MsgSendTransaction['value'];
      userAddress = from_address === myAddress ? to_address : from_address;
      updateChat(chats, userAddress, t, amount);
    }
  });

  return chats;
};
