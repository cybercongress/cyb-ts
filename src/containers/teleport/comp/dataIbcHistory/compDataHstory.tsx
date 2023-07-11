import { Coin } from '@cosmjs/launchpad';
import { useMemo } from 'react';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { CYBER, PATTERN_CYBER } from 'src/utils/config';
import {
  getDisplayAmount,
  getNowUtcTime,
  timeSince,
  trimString,
} from 'src/utils/utils';
import { FormatNumberTokens } from 'src/containers/nebula/components';
import fromToIbc from 'images/fromToIbc.svg';
import { Account, DenomArr } from 'src/components';
import upArrow from 'images/up-arrow.png';
import downArrow from 'images/down-arrow.png';
import complete from 'images/statusTx/complete.png'
import pending from 'images/statusTx/pending.png'
import timeout from 'images/statusTx/timeout.png'
import refunded from 'images/statusTx/refunded.png'
import { TxsType } from '../../type';
import { HistoriesItem, StatusTx } from '../../ibc-history/HistoriesItem';
import styles from './styles.module.scss';

const mapStatusTxImg = {
  [StatusTx.COMPLETE]: complete,
  [StatusTx.PENDING]: pending,
  [StatusTx.TIMEOUT]: timeout,
  [StatusTx.REFUNDED]: refunded,
}

export function TypeTsx({ sourceChainId }: { sourceChainId: string }) {
  if (sourceChainId === CYBER.CHAIN_ID) {
    return (
      <div className={styles.containerTypeTsx}>
        <img src={upArrow} alt="upArrow" />
        <div>{TxsType.Withdraw}</div>
      </div>
    );
  }

  return (
    <div className={styles.containerTypeTsx}>
      <img src={downArrow} alt="downArrow" />
      <div>{TxsType.Deposit}</div>
    </div>
  );
}

export function AmountSend({
  coin,
  sourceChainId,
}: {
  coin: Coin;
  sourceChainId: string;
}) {
  const { traseDenom } = useIbcDenom();
  const typeTxs =
    sourceChainId === CYBER.CHAIN_ID ? TxsType.Withdraw : TxsType.Deposit;
  const amountDenom = useMemo(() => {
    if (traseDenom) {
      const [{ coinDecimals }] = traseDenom(coin.denom);
      const amount = getDisplayAmount(coin.amount, coinDecimals);
      return amount;
    }

    return 0;
  }, [coin, traseDenom]);

  return (
    <FormatNumberTokens
      text={coin.denom}
      value={amountDenom}
      styleValue={{
        color: typeTxs === TxsType.Deposit ? '#76FF03' : '#FF5C00',
        fontSize: '18px',
      }}
    />
  );
}

export function Status({ status }: { status: StatusTx }) {
  return (
    <div className={styles.containerTypeTsx}>
      <img src={mapStatusTxImg[status]} alt={status} />
      <div>{status}</div>
    </div>
  );
}

function AddressType({ address }: { address: string }) {
  return <div style={{ color: '#fff' }}>{trimString(address, 8, 2)}</div>;
}

export function CreatedAt({ timeAt }: { timeAt: number }) {
  let timeAgoInMS = null;

  const time = getNowUtcTime() - new Date(timeAt).getTime();
  if (time && time > 0) {
    timeAgoInMS = time;
  }

  const timeSinceValue = timeSince(timeAgoInMS);

  return (
    <div>
      {timeSinceValue === 'now' ? timeSinceValue : timeSinceValue + ' ago'}
    </div>
  );
}

export function RouteAddress({ item }: { item: HistoriesItem }) {
  const { recipient, sender, sourceChainId, destChainId } = item;

  const TagSender = sender.match(PATTERN_CYBER) ? Account : AddressType;
  const TagRecipient = recipient.match(PATTERN_CYBER) ? Account : AddressType;

  return (
    <div className={styles.containerRouteAddress}>
      <div className={styles.containerAddressChainId}>
        <TagSender address={sender} />
        <DenomArr type="network" onlyImg denomValue={sourceChainId} />
      </div>
      <img src={fromToIbc} alt="fromToIbc" className={styles.fromToIbcImg} />
      <div
        className={styles.containerAddressChainId}
        style={{ marginLeft: '-5px' }}
      >
        <TagRecipient address={recipient} />
        <DenomArr type="network" onlyImg denomValue={destChainId} />
      </div>
    </div>
  );
}
