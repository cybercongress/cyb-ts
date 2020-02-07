import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import {
  CardTemplate,
  Link,
  StatusTooltip,
  FormatNumber,
} from '../../components';
import { formatNumber } from '../../utils/utils';
import { CYBER } from '../../utils/config';

const dateFormat = require('dateformat');

export const Row = ({ value, title, marginBottom }) => (
  <Pane
    key={`${value}-container`}
    style={{ marginBottom: marginBottom || 0 }}
    className="txs-contaiter-row"
    display="flex"
  >
    <Text
      key={`${title}-title`}
      display="flex"
      fontSize="15px"
      textTransform="capitalize"
      color="#fff"
      whiteSpace="nowrap"
      width="240px"
      marginBottom="5px"
      lineHeight="20px"
    >
      {title} :
    </Text>
    <Text
      key={`${value}-value`}
      display="flex"
      color="#fff"
      fontSize="14px"
      wordBreak="break-all"
      lineHeight="20px"
      marginBottom="5px"
      flexDirection="column"
      alignItems="flex-start"
    >
      {value}
    </Text>
  </Pane>
);

const Delegated = ({ data, marginBottom }) => {
  const {
    self,
    selfPercent,
    others,
    othersPercent,
    total,
    jailed,
    unbondingTime,
    unbondingHeight,
    delegatorShares,
  } = data;

  return (
    <Pane
      marginBottom={marginBottom || 0}
      // className="ValidatorInfo__Delegated-MissedBlocks-wrapper"
    >
      <CardTemplate title="Delegated" paddingLeftChild={10} paddingBottom={20}>
        <Pane marginBottom={10}>
          <Pane>Total</Pane>
          <FormatNumber
            number={formatNumber(total / CYBER.DIVISOR_CYBER_G, 6)}
            currency={CYBER.DENOM_CYBER_G}
            fontSize={18}
          />
        </Pane>
        <Row
          title="Delegator Shares"
          value={`${formatNumber(
            Math.floor(delegatorShares)
          )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
        />
        <Row
          title="Token"
          value={`${formatNumber(
            Math.floor(total)
          )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
        />
        <Row
          title="Self Stake"
          value={
            <Pane display="flex">
              {formatNumber(selfPercent, 2)}% (
              <FormatNumber
                number={formatNumber(self / CYBER.DIVISOR_CYBER_G, 6)}
                currency={CYBER.DENOM_CYBER_G}
                fontSizeDecimal={12}
              />
              )
            </Pane>
          }
        />
        {jailed && (
          <Pane>
            <Row
              title="Unbonding Height"
              value={formatNumber(parseFloat(unbondingHeight))}
            />
            <Row
              title="Unbonding Time"
              value={dateFormat(unbondingTime, 'dd/mm/yy hh:mm tt')}
            />
          </Pane>
        )}
      </CardTemplate>
    </Pane>
  );
};

export default Delegated;
