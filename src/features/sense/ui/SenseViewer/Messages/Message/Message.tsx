import { Account, Tooltip } from 'src/components';
import styles from './Message.module.scss';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { routes } from 'src/routes';
import { Link, useNavigate } from 'react-router-dom';
import Date from '../../../components/Date/Date';
import cx from 'classnames';
import { SenseItem } from 'src/features/sense/redux/sense.redux';
import CoinsAmount, {
  CoinAction,
} from '../../../components/CoinAmount/CoinAmount';

type Props = {
  date: string | Date;
  transactionHash: string;
  content: string | JSX.Element;
  amountData?: {
    amount: MsgSend['amount'] | undefined;
    isAmountSendToMyAddress?: boolean;
  };

  myMessage?: boolean;
  cid?: string;
  fromLog?: boolean;
  status?: SenseItem['status'];
};

function Message({
  content,
  date,
  amountData,
  fromLog,
  transactionHash,
  from,
  myMessage,
  cid,
  status,
}: Props) {
  const navigate = useNavigate();

  function handleNavigate() {
    navigate(
      cid
        ? routes.oracle.ask.getLink(cid)
        : routes.txExplorer.getLink(transactionHash)
    );
  }

  return (
    <div
      className={cx(styles.wrapper, {
        [styles.myMessage]: myMessage,
        [styles.pending]: status === 'pending',
        [styles.error]: status === 'error',
      })}
    >
      <div className={styles.dateBlock}>
        <Link
          className={cx(styles.tx, {
            [styles[`status_${status}`]]: status,
          })}
          to={routes.txExplorer.getLink(transactionHash)}
        >
          <Date timestamp={date} timeOnly />
        </Link>

        {fromLog && from && (
          <>
            {!myMessage && (
              <Link to={routes.neuron.getLink(from)}>
                <Account address={from} sizeAvatar="20px" avatar onlyAvatar />
              </Link>
            )}
          </>
          // <Tooltip tooltip="message from log">
          // <span className={styles.icon}>🍀</span>
          // </Tooltip>
        )}
      </div>

      {/* <Link> not good here, because children may have links  */}
      {/* Twitter example */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          // inner link clicked
          if (e.target instanceof HTMLAnchorElement) {
            return;
          }
          // if text not selected
          // shouldn't be null
          if (window.getSelection().toString() === '') {
            handleNavigate();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleNavigate();
          }
        }}
        className={styles.content}
      >
        {content}

        {!!amountData?.amount?.length && (
          <div className={styles.amount}>
            <CoinsAmount
              amount={amountData.amount}
              type={
                amountData.isAmountSendToMyAddress === false
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
