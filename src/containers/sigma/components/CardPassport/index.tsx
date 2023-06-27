import { useMemo, useEffect, useContext } from 'react';
import { Dots, ContainerGradientText } from '../../../../components';
import { useGetBalanceBostrom } from '../../hooks';
import { SigmaContext } from '../../SigmaContext';
import { TitleCard, RowBalancesDetails } from '../cardUi';
import { Citizenship } from 'src/types/citizenship';

type Props = {
  address: string; // bostrom address
  passport: Citizenship | null;
  selectAddress?: (address: string) => void;
  selectedAddress?: string;
};

function CardPassport({
  address,
  selectAddress,
  passport,
  selectedAddress,
}: Props) {
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
    <ContainerGradientText
      status="green"
      userStyleContent={{ height: 'auto', padding: '0 20px' }}
    >
      <TitleCard
        address={address}
        passport={passport}
        // selectAddress={selectAddress}
        selected={selectedAddress ? selectedAddress === address : false}
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
            key={address}
            address={address}
            passport={null}
            selected={selectedAddress ? selectedAddress === address : false}
            selectAddress={selectAddress}
          />
        );
      })}
    </ContainerGradientText>
  );
}

export default CardPassport;
