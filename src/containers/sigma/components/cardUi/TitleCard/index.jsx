import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { CYBER } from '../../../../../utils/config';
import { formatNumber } from '../../../../../utils/utils';
import { FormatNumberTokens } from '../../../../nebula/components';
import { Signatures } from '../../../../portal/components';
import { AvataImgIpfs } from '../../../../portal/components/avataIpfs';
import styles from './styles.scss';

function TitleCard({ accounts, passport, totalLiquid, node }) {
  const useGetName = useMemo(() => {
    if (passport && passport !== null) {
      return passport.extension.nickname;
    }
    return '';
  }, [passport]);

  const useGetCidAvatar = useMemo(() => {
    if (passport && passport !== null) {
      return passport.extension.avatar;
    }
    return '';
  }, [passport]);

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <AvataImgIpfs cidAvatar={useGetCidAvatar} node={node} />
      </div>
      <div className={styles.name}>{useGetName}</div>
      <div className={styles.total}>
        {totalLiquid.change !== 0 && (
          <div
            style={{
              color: totalLiquid.change > 0 ? '#7AFAA1' : '#FF0000',
            }}
          >
            {totalLiquid.change > 0 ? '+' : ''}
            {formatNumber(totalLiquid.change)}
          </div>
        )}
        <FormatNumberTokens
          value={totalLiquid.currentCap}
          text={CYBER.DENOM_LIQUID_TOKEN}
          styleValue={{ fontSize: '18px' }}
        />
      </div>
      <div className={styles.address}>
        <Signatures addressActive={accounts} />
      </div>
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(TitleCard);
