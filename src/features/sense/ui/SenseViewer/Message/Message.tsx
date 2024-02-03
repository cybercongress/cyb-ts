import { Account, Tooltip } from 'src/components';
import styles from './Message.module.scss';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import Date from '../../components/Date/Date';
import cx from 'classnames';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import CoinsAmount, {
  CoinAction,
} from '../../components/CoinAmount/CoinAmount';
import { getStatusText } from '../../utils/getStatusText';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { isParticle } from 'src/features/particle/utils';

type Props = {
  address: string;
  content: string | JSX.Element;
  date: number;
  amountData?: {
    amount: MsgSend['amount'] | undefined;
    isAmountSendToMyAddress: boolean;
  };
  txHash?: string;
  // fix
  status: SenseItem['status'];
};

function Message({
  address,
  content,
  date,
  amountData,
  txHash,
  status,
}: Props) {
  const myAddress = useAppSelector(selectCurrentAddress);
  const myMessage = address === myAddress;
  const particle = isParticle(address);

  return (
    <div
      className={cx(styles.wrapper, {
        [styles.myMessage]: myMessage,
        [styles.pending]: status === 'pending',
      })}
    >
      {/* <div className={styles.avatar}>
        <Account address={address} onlyAvatar avatar sizeAvatar={40} />
      </div> */}
      {/* <h6><Account address={address} /></h6> */}

      <div className={styles.timestampBlock}>
        {/* {txHash && (
          // <Tooltip
          //   tooltip={(() => {
          //     if (status === 'pending') {
          //       return 'Tx pending - view';
          //     }
          //     if (status === 'error') {
          //       return 'Tx error - view';
          //     }
          //     return 'View tx';
          //   })()}
          // ></Tooltip>
        // )} */}

        <Link
          className={cx(styles.tx, {
            [styles[`status_${status}`]]: status,
          })}
          // target="_blank"
          to={routes.txExplorer.getLink(txHash)}
        >
          {/* {getStatusText(status) || '✔'} */}
          <Date timestamp={+date} timeOnly />
        </Link>
      </div>

      <div className={styles.body}>
        {content && <div className={styles.content}>{content}</div>}

        {amountData?.amount && (
          <div className={styles.amount}>
            <CoinsAmount
              amount={amountData.amount}
              type={
                !amountData.isAmountSendToMyAddress
                  ? CoinAction.send
                  : CoinAction.receive
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
