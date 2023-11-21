import { Coin } from '@cosmjs/launchpad';
import { useMemo } from 'react';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { CYBER, PATTERN_CYBER } from 'src/utils/config';
import { getDisplayAmount, trimString } from 'src/utils/utils';
import ImgArrow from 'images/fromToIbc.svg';
import { Account, DenomArr, FormatNumberTokens } from 'src/components';
import upArrow from 'images/up-arrow.png';
import downArrow from 'images/down-arrow.png';
import complete from 'images/statusTx/complete.png';
import pending from 'images/statusTx/pending.png';
import timeout from 'images/statusTx/timeout.png';
import refunded from 'images/statusTx/refunded.png';
import { CssVariables } from 'src/style/variables';
import cx from 'classnames';
import { TxsType } from '../../type';
import { HistoriesItem, StatusTx } from '../../ibc-history/HistoriesItem';
import styles from './DataHistoryItems.module.scss';

const mapStatusTxImg = {
  [StatusTx.COMPLETE]: complete,
  [StatusTx.PENDING]: pending,
  [StatusTx.TIMEOUT]: timeout,
  [StatusTx.REFUNDED]: refunded,
};

export function TypeTsx({ sourceChainId }: { sourceChainId: string }) {
  const isCyberChain = sourceChainId === CYBER.CHAIN_ID;

  return (
    <div className={styles.containerTypeTsx}>
      <img src={isCyberChain ? upArrow : downArrow} alt="imgArrow" />
      <div>{isCyberChain ? TxsType.Withdraw : TxsType.Deposit}</div>
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
        color:
          typeTxs === TxsType.Deposit
            ? CssVariables.GREEN_LIGHT_COLOR
            : CssVariables.RED_COLOR,
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

function AddressIbc({ address }: { address: string }) {
  return <div className={styles.AddressIbc}>{trimString(address, 8, 2)}</div>;
}

function addressType(address: string) {
  if (address.match(PATTERN_CYBER)) {
    return <Account address={address} />;
  }
  return <AddressIbc address={address} />;
}

export function RouteAddress({ item }: { item: HistoriesItem }) {
  const { recipient, sender, sourceChainId, destChainId } = item;

  return (
    <div className={styles.containerRouteAddress}>
      <div className={styles.containerAddressChainId}>
        {addressType(sender)}
        <DenomArr type="network" onlyImg denomValue={sourceChainId} />
      </div>
      <img src={ImgArrow} alt="ImgArrow" className={styles.fromToIbcImg} />
      <div
        className={cx(
          styles.containerAddressChainId,
          styles.containerAddressChainIdMarginLeft
        )}
      >
        {addressType(recipient)}
        <DenomArr type="network" onlyImg denomValue={destChainId} />
      </div>
    </div>
  );
}
