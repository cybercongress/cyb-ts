import { DenomArr } from '../../../../../components';
import { formatNumber } from '../../../../../utils/utils';
import styles from './FormatNumberTokens.module.scss';

type Props = {
  text?: string;
  value: string;
};

function FormatNumberTokens({ text, value, ...props }: Props) {
  return (
    <div className={styles.containerFormatNumberTokens} {...props}>
      <span>{formatNumber(parseFloat(value))}</span>
      {text && <DenomArr denomValue={text} onlyImg />}
    </div>
  );
}

export default FormatNumberTokens;
