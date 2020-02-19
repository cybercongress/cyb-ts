import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { CardTemplate, StatusTooltip, FormatNumber } from '../../components';
import { formatNumber } from '../../utils/utils';
import { CYBER } from '../../utils/config';
import KeybaseCheck from './keybaseCheck';
import KeybaseAvatar from './keybaseAvatar';

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

const ValidatorInfo = ({ data, marginBottom }) => {
  const {
    rate,
    max_rate: maxRate,
    max_change_rate: maxChangeRate,
  } = data.commission.commission_rates;

  const { moniker, identity, website, details } = data.description;

  return (
    <CardTemplate marginBottom={marginBottom} paddingBottom={20}>
      <Pane className="ValidatorInfo__info-wrapper" display="flex">
        <Pane className="ValidatorInfo__moniker-avatar-wrapper-mobi">
          <Pane
            width={80}
            height={80}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <KeybaseAvatar identity={identity} />
          </Pane>
          <Pane className="ValidatorInfo__moniker-wrapper-mobi">
            <Pane fontSize="25px">{moniker}</Pane>

            <StatusTooltip status={data.status} size={10} />
          </Pane>
        </Pane>
        <Pane width="100%" className="ValidatorInfo__addrs-wrapper">
          <Pane marginBottom={15} className="ValidatorInfo__moniker-wrapper">
            <Pane fontSize="25px">{moniker}</Pane>

            <StatusTooltip status={data.status} size={10} />
          </Pane>
        </Pane>
      </Pane>
      <Pane>
        {website.length > 0 && <Row title="Website" value={website} />}
        {identity.length > 0 && (
          <Row title="Identity" value={<KeybaseCheck identity={identity} />} />
        )}
        <Row
          title="Voting Power"
          value={
            <Pane display="flex">
              {formatNumber(data.votingPower, 3)}% (
              <FormatNumber
                fontSizeDecimal={12}
                number={formatNumber(data.tokens / CYBER.DIVISOR_CYBER_G, 6)}
                currency={CYBER.DENOM_CYBER_G}
              />
              )
            </Pane>
          }
        />
        {details.length > 0 && <Row title="Details" value={details} />}
      </Pane>
    </CardTemplate>
  );
};

export default ValidatorInfo;
