import { CYBER } from '../../../../../utils/config';
import { formatNumber } from '../../../../../utils/utils';
import { FormatNumberTokens } from '../../../../nebula/components';
import { Signatures } from '../../../../portal/components';
import styles from './styles.scss';
import { Citizenship } from 'src/types/citizenship';
import { DenomArr } from 'src/components';
import { getTypeFromAddress } from 'src/utils/address';
import { Networks } from 'src/types/networks';

interface Props {
  address: string;
  passport: Citizenship;
  totalLiquid?: any;
  selectAddress: any;
}

function TitleCard({ address, passport, totalLiquid, selectAddress }: Props) {
  const addressNetwork = getTypeFromAddress(address);

  return (
    <div className={styles.container} onClick={() => selectAddress(address)}>
      <DenomArr denomValue={addressNetwork} onlyImg type="network" size={30} />

      <div className={styles.address}>
        <Signatures
          addressActive={{ bech32: address }}
          disabled={
            ![Networks.BOSTROM, Networks.SPACE_PUSSY].includes(addressNetwork)
          }
        />
      </div>

      {/* <div className={styles.avatar}>
        <AvataImgIpfs cidAvatar={useGetCidAvatar} />
      </div> */}
      {/* <div className={styles.name}>{useGetName}</div> */}

      {totalLiquid && (
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
            // styleValue={{ fontSize: '18px' }}
          />
        </div>
      )}
    </div>
  );
}

export default TitleCard;
