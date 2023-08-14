import { DenomArr } from 'src/components';
import { getTypeFromAddress } from 'src/utils/address';
import { Networks } from 'src/types/networks';
import cx from 'classnames';
import TokenChange from 'src/components/TokenChange/TokenChange';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './TitleCard.module.scss';
import { Signatures } from '../../../../portal/components';

interface Props {
  address: string;
  totalLiquid?: {
    currentCap: number;
    change: number;
  };
  selectAddress?: (address: string) => void;
  selected: boolean;
}

function TitleCard({ address, totalLiquid, selectAddress, selected }: Props) {
  const addressNetwork = getTypeFromAddress(address);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cx(styles.container, {
        [styles.select]: selectAddress,
        [styles.selected]: selected,
      })}
      onClick={selectAddress ? () => selectAddress(address) : undefined}
    >
      <DisplayTitle
        inDisplay
        image={
          <DenomArr
            denomValue={addressNetwork}
            onlyImg
            tooltipStatusImg={false}
            type="network"
            size={37}
          />
        }
        title={
          <div className={styles.address}>
            <Signatures
              addressActive={{ bech32: address }}
              disabled={
                ![Networks.BOSTROM, Networks.SPACE_PUSSY].includes(
                  addressNetwork
                )
              }
            />
          </div>
        }
      >
        {totalLiquid && (
          <TokenChange
            className={styles.total}
            total={totalLiquid.currentCap}
            // change={totalLiquid.change}
          />
        )}
      </DisplayTitle>
    </div>
  );
}

export default TitleCard;
