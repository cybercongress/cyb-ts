import { Pane } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { ContainerAddressInfo, Address } from '../../components';
import { Dots } from '../../../../components';
import { trimString } from '../../../../utils/utils';
import { CYBER } from '../../../../utils/config';
import {
  RowBalance,
  FormatNumberTokens,
  DetailsBalance,
  BalanceToken,
} from '../PubkeyCard';

export type Props = {
  totalCyber: any;
  address: {
    bech32: string;
  };
  loading: boolean;
  openEul: boolean;
  onClickDeleteAddress: () => void;
  network: any;
  balanceToken: any;
  onClick: () => void;
};

function EULnetworkInfo({
  totalCyber,
  address,
  loading,
  openEul,
  onClickDeleteAddress,
  network,
  balanceToken,
  onClick,
  ...props
}: Props) {
  return (
    <ContainerAddressInfo>
      <Address
        network={network}
        address={address}
        onClickDeleteAddress={onClickDeleteAddress}
        addressLink={
          <Link to={`/network/bostrom/contract/${address.bech32}`}>
            <div>{trimString(address.bech32, 9, 3)}</div>
          </Link>
        }
      />
      <Pane flexDirection="column" display="flex" alignItems="flex-end">
        {loading ? (
          <span>
            <Dots /> CYB
          </span>
        ) : (
          <>
            <RowBalance
            onClick={onClick}
              marginBottom={4}
              className="cosmos-address-balance"
            >
              {openEul ? (
                <div>total</div>
              ) : (
                <div className="details-balance">details</div>
              )}
              {/* <NumberCurrency
                      amount={totalCyber.total}
                      currencyNetwork={CYBER.DENOM_CYBER}
                    /> */}
              <FormatNumberTokens
                value={totalCyber.total}
                text={CYBER.DENOM_CYBER}
              />
              {/* <Pane>{formatCurrency(totalCyber.total, 'eul')}</Pane> */}
            </RowBalance>
            {openEul && (
              <DetailsBalance
                total={totalCyber}
                address={address.bech32}
                paddingLeft={15}
              />
            )}

            {Object.keys(balanceToken).map((key) => {
              // console.log('Object', Object.keys(balanceToken[key].length))
              if (Object.keys(balanceToken[key]).length > 0) {
                return (
                  <BalanceToken
                    key={key}
                    onClickOpen={props[`onClickOpen${key}`]}
                    open={props[`open${key}`]}
                    balanceToken={balanceToken[key]}
                    currency={key}
                    address={address}
                  />
                );
              }
              return (
                <FormatNumberTokens
                  key={key}
                  value={balanceToken[key]}
                  text={key}
                  marginBottom={4}
                />
              );
            })}
          </>
        )}
      </Pane>
    </ContainerAddressInfo>
  );
}

export default EULnetworkInfo;
