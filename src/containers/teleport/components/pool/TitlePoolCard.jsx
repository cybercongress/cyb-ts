import { DenomArr } from '../../../../components';
import { CYBER } from '../../../../utils/config';
import { FormatNumberTokens } from '../../../nebula/components';
import styles from './styles.scss';

function TitlePool({ pool, totalCap, useInactive }) {
  return (
    <div className={styles.TitlePoolContainer}>
      <div className={styles.TitlePoolContainerInfoPool}>
        <div className={styles.TitlePoolContainerInfoPoolPoolText}>
          #{pool.id}
        </div>

        <div className={styles.TitlePoolContainerInfoPoolImg}>
          <DenomArr
            size={30}
            denomValue={pool.reserve_coin_denoms[0]}
            onlyImg
            zIndexImg={1}
          />
          <DenomArr
            size={30}
            denomValue={pool.reserve_coin_denoms[1]}
            onlyImg
            marginContainer="0px 0px 0px -8px"
          />
        </div>

        <div className={styles.TitlePoolContainerInfoPoolDenom}>
          <DenomArr denomValue={pool.reserve_coin_denoms[0]} onlyText />/
          <DenomArr denomValue={pool.reserve_coin_denoms[1]} onlyText />
        </div>
      </div>
      {totalCap !== undefined && (
        <FormatNumberTokens
          value={totalCap}
          text={CYBER.DENOM_LIQUID_TOKEN}
          marginContainer="0px"
        />
      )}
      {useInactive && (
        <div className={styles.TitlePoolContainerInactive}>inactive</div>
      )}
    </div>
  );
}

export default TitlePool;
