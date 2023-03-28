import { DenomArr } from '../../../../../components';
import { formatNumber } from '../../../../../utils/utils';
import styles from './styles.scss';

function FormatNumberTokens({ text, value, ...props }) {
  return (
    <div className={styles.containerFormatNumberTokens} {...props}>
      <div className={styles.containerFormatNumberTokensValue}>
        <span>{formatNumber(parseFloat(value))}</span>
      </div>
      {text && <DenomArr denomValue={text} onlyImg />}
    </div>
  );
}

export default FormatNumberTokens;
