import Display from 'src/components/containerGradient/Display/Display';
import { Account, FormatNumber, Row, RowsContainer } from 'src/components';
import { formatNumber, fromBech32 } from 'src/utils/utils';
import { Validator } from '@cybercongress/cyber-ts/cosmos/staking/v1beta1/staking';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';
import { BASE_DENOM } from 'src/constants/config';
import BigNumber from 'bignumber.js';

const dateFormat = require('dateformat');

function Details({ data }: { data: Validator }) {
  const { rate, maxChangeRate, maxRate } = data.commission.commissionRates;
  const delegateAddress = fromBech32(data.operatorAddress);
  return (
    <Display>
      <RowsContainer>
        <Row title="Operator Address" value={data.operatorAddress} />
        <Row
          title="Address"
          value={<Account avatar sizeAvatar={30} address={delegateAddress} />}
        />
        {data.description.details && (
          <Row title="Details" value={data.description.details} />
        )}
        {/* {data.description.identity && (
          <Row
            title="Identity"
            value={<KeybaseCheck identity={data.description.identity} />}
          />
        )} */}
        <Row
          title="Delegator Shares"
          value={<IconsNumber type={BASE_DENOM} value={data.delegatorShares} />}
        />
        <Row
          title="Commission Rate"
          value={
            <FormatNumber
              currency="%"
              number={new BigNumber(rate).multipliedBy(100).toFixed(2)}
            />
          }
        />
        {/* <Row
          title="Max Rate"
          value={
            <FormatNumber
              currency="%"
              number={new BigNumber(maxRate).multipliedBy(100).toFixed(2)}
            />
          }
        />
        <Row
          title="Max Change Rate"
          value={
            <FormatNumber
              currency="%"
              number={new BigNumber(maxChangeRate).multipliedBy(100).toFixed(2)}
            />
          }
        /> */}
        {/* <Row
          title="Self Stake"
          value={
            <Pane display="flex">
              {formatNumber(selfPercent, 2)}% (
              <FormatNumber
                number={formatNumber(self / DIVISOR_CYBER_G, 6)}
                currency={`G${BASE_DENOM.toUpperCase()}`}
                fontSizeDecimal={12}
              />
              )
            </Pane>
          }
        /> */}

        {data.jailed && (
          <>
            <Row
              title="Unbonding Height"
              value={formatNumber(BigInt(data.unbondingHeight).toString())}
            />
            <Row
              title="Unbonding Time"
              value={dateFormat(data.unbondingTime, 'dd/mm/yy hh:mm tt')}
            />
          </>
        )}
      </RowsContainer>
    </Display>
  );
}

export default Details;
