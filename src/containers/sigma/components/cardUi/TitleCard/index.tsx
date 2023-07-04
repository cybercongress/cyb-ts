import { CYBER } from '../../../../../utils/config';
import { formatNumber } from '../../../../../utils/utils';
import { FormatNumberTokens } from '../../../../nebula/components';
import { Signatures } from '../../../../portal/components';
import styles from './styles.scss';
import { Citizenship } from 'src/types/citizenship';
import { ContainerGradientText, DenomArr } from 'src/components';
import { getTypeFromAddress } from 'src/utils/address';
import { Networks } from 'src/types/networks';
import cx from 'classnames';
import TokenChange from 'src/components/TokenChange/TokenChange';

interface Props {
  address: string;
  passport: Citizenship;
  totalLiquid?: {
    currentCap: number;
    change: number;
  };
  selectAddress?: (address: string) => void;
  selected: boolean;
}

function TitleCard({
  address,
  passport,
  totalLiquid,
  selectAddress,
  selected,
}: Props) {
  const addressNetwork = getTypeFromAddress(address);

  return (
    // <ContainerGradientText
    // status="grey"
    // userStyleContent={{
    // margin: '-15px',
    // }}
    // >
    <div
      className={cx(styles.container, {
        [styles.select]: selectAddress,
        [styles.selected]: selected,
      })}
      onClick={selectAddress ? () => selectAddress(address) : undefined}
    >
      <DenomArr
        denomValue={addressNetwork}
        onlyImg
        tooltipStatusImg={false}
        type="network"
        size={37}
      />

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
        <TokenChange
          className={styles.total}
          total={totalLiquid.currentCap}
          change={totalLiquid.change}
        />
      )}
    </div>
    // </ContainerGradientText>
  );
}

export default TitleCard;
