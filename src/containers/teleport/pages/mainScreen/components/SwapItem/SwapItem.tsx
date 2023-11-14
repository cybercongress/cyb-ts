import { DenomArr } from 'src/components';
import rectangle from 'images/rectangle.svg';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { SelectedPool } from '../../type';
import styles from './styles.module.scss';

type Props = {
  item: SelectedPool;
};

type flexRow = {
  children: React.ReactNode;
  reverse?: boolean;
};

function FlexRow({ children, reverse }: flexRow) {
  return (
    <div
      className={cx(styles.containerRoweDenom, {
        [styles.containerRoweDenomReverse]: reverse,
      })}
    >
      {children}
    </div>
  );
}

function DenomsText({ item }: Props) {
  return (
    <FlexRow reverse={item.reverse}>
      <DenomArr
        denomValue={item.base_currency}
        onlyText
        tooltipStatusText={false}
      />
      -
      <DenomArr
        denomValue={item.target_currency}
        onlyText
        tooltipStatusText={false}
      />
    </FlexRow>
  );
}

function DenomsImg({ item }: Props) {
  return (
    <FlexRow reverse={item.reverse}>
      <DenomArr
        denomValue={item.base_currency}
        onlyImg
        tooltipStatusImg={false}
        size={30}
      />
      <img style={{ width: '25px' }} src={rectangle} alt="img" />
      <DenomArr
        denomValue={item.target_currency}
        onlyImg
        tooltipStatusImg={false}
        size={30}
      />
    </FlexRow>
  );
}

function SwapItem({ item }: Props) {
  const searchParam = item.reverse
    ? `from=${item.target_currency}&to=${item.base_currency}`
    : `from=${item.base_currency}&to=${item.target_currency}`;
  return (
    <Link
      to={`swap?${searchParam}`}
      key={item.ticker_id}
      className={styles.containerSwapItem}
    >
      <DenomsImg item={item} />
      <DenomsText item={item} />
    </Link>
  );
}

export default SwapItem;
