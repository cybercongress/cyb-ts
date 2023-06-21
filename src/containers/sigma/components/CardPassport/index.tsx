import { useMemo, useEffect, useContext } from 'react';
import {
  Dots,
  ContainerGradient,
  ContainerGradientText,
} from '../../../../components';
import { useGetBalanceBostrom, useGetPassportByAddress } from '../../hooks';
import { SigmaContext } from '../../SigmaContext';
import { TitleCard, RowBalancesDetails } from '../cardUi';
import { useSelector } from 'react-redux';
import { Citizenship } from 'src/types/citizenship';

type Props = {
  address: string; // bostrom address
  passport: Citizenship | null;
  selectAddress: (address: string) => void;
};

function CardPassport({ address, selectAddress, passport }: Props) {
  const { updateDataCap } = useContext(SigmaContext);
  const { totalAmountInLiquid, balances, totalAmountInLiquidOld } =
    useGetBalanceBostrom(address);

  useEffect(() => {
    if (!address) return;

    updateDataCap({ [address]: { ...totalAmountInLiquid } });
  }, [address, totalAmountInLiquid]);

  const reduceDataBalanceTokenRow = useMemo(() => {
    let dataObj = {};
    if (Object.keys(balances).length > 0) {
      const sortable = Object.fromEntries(
        Object.entries(balances).sort(
          ([, a], [, b]) => b.cap.amount - a.cap.amount
        )
      );
      dataObj = sortable;
    }
    return dataObj;
  }, [balances]);

  const renderBalanceTokenRow = useMemo(() => {
    return Object.keys(reduceDataBalanceTokenRow).map((key) => {
      return (
        <RowBalancesDetails
          balance={reduceDataBalanceTokenRow[key]}
          key={key}
        />
      );
    });
  }, [reduceDataBalanceTokenRow]);

  return (
    <ContainerGradientText userStyleContent={{ height: 'auto' }}>
      <TitleCard
        address={address}
        passport={passport}
        selectAddress={selectAddress}
        totalLiquid={
          totalAmountInLiquid.currentCap > 0
            ? totalAmountInLiquid
            : totalAmountInLiquidOld
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {Object.keys(renderBalanceTokenRow).length > 0 ? (
          renderBalanceTokenRow
        ) : (
          <Dots />
        )}
      </div>

      {passport?.extension?.addresses.map(({ address }) => {
        return (
          <TitleCard
            address={address}
            passport={null}
            selectAddress={selectAddress}
          />
        );
      })}
    </ContainerGradientText>
  );
}

export default CardPassport;
