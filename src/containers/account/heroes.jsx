import React from 'react';
import {
  Pane,
  Text,
  Tooltip,
  TableEv as Table,
  Icon,
} from '@cybercongress/gravity';
import { CardTemplate, Account } from '../../components';
import { formatNumber, formatCurrency } from '../../utils/utils';
import { CYBER } from '../../utils/config';

const noitem = require('../../image/noitem.svg');

const getDaysIn = time => {
  const completionTime = new Date(time);
  const timeNow = Date.now();

  const daysIn = (completionTime - timeNow) / 1000 / 60 / 60 / 24;

  return Math.round(daysIn);
};

const Img = ({ img }) => (
  <img style={{ width: '45px', height: '45px' }} src={img} alt="img" />
);

const Noitem = ({ text }) => (
  <Pane display="flex" paddingY={40} alignItems="center" flexDirection="column">
    <Img img={noitem} />
    <Text fontSize="18px" color="#fff">
      {text}
    </Text>
  </Pane>
);

const TextTable = ({ children, fontSize, color, display, ...props }) => (
  <Text
    fontSize={`${fontSize || 16}px`}
    color={`${color || '#fff'}`}
    display={`${display || 'inline-flex'}`}
    {...props}
  >
    {children}
  </Text>
);

const Unbonding = ({ amount, stages, entries }) => (
  <Pane display="flex" alignItems="flex-end">
    <Pane
      // key={}
      fontSize="16px"
      display="inline"
      color="#fff"
      width="100%"
      textOverflow="ellipsis"
      overflow="hidden"
    >
      {stages > 1
        ? `${formatCurrency(
            amount,
            CYBER.DENOM_CYBER.toUpperCase()
          )} in ${stages} stages`
        : `${formatCurrency(
            entries[0].balance,
            CYBER.DENOM_CYBER.toUpperCase()
          )} in 
      ${getDaysIn(entries[0].completion_time)} days`}
    </Pane>
    <Tooltip
      content={entries.map((items, index) => (
        <div key={index}>
          {`${formatNumber(
            parseFloat(items.balance)
          )} ${CYBER.DENOM_CYBER.toUpperCase()}`}{' '}
          in {getDaysIn(items.completion_time)} days
        </div>
      ))}
      position="bottom"
    >
      <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
    </Tooltip>
  </Pane>
);

const Heroes = ({ data, ...props }) => {
  console.log('data.delegations', data.delegations);
  const delegations = data.delegations.map(item => {
    let amount = 0;
    if (item.entries !== undefined) {
      item.entries.forEach(entry => {
        amount += parseFloat(entry.balance);
      });
    }

    return (
      <Table.Row
        borderBottom="none"
        key={item.validator_address}
        display="flex"
        marginBottom={10}
        minHeight="48px"
        height="fit-content"
        paddingY={5}
        paddingX={5}
      >
        <Table.TextCell flex={2} textAlign="start">
          <TextTable>
            <Account address={item.validator_address} />
          </TextTable>
        </Table.TextCell>
        <Table.TextCell flex={1.5} textAlign="end">
          {item.entries !== undefined && (
            <Unbonding
              amount={amount}
              stages={item.entries.length}
              entries={item.entries}
            />
          )}
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          {item.reward !== undefined && (
            <Tooltip
              content={`${formatNumber(
                item.reward
              )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
              position="bottom"
            >
              <TextTable>
                {formatCurrency(item.reward, CYBER.DENOM_CYBER.toUpperCase())}
              </TextTable>
            </Tooltip>
          )}
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          <Tooltip
            content={`${formatNumber(
              parseFloat(item.balance.amount)
            )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
            position="bottom"
          >
            <TextTable>
              {formatCurrency(
                parseFloat(item.balance.amount),
                CYBER.DENOM_CYBER.toUpperCase()
              )}
            </TextTable>
          </Tooltip>
        </Table.TextCell>
      </Table.Row>
    );
  });

  return (
    <Pane display="grid" gridGap="20px" gridTemplateColumns="1fr" {...props}>
      <Table>
        <Table.Head
          style={{
            backgroundColor: '#000',
            borderBottom: '1px solid #ffffff80',
            marginTop: '10px',
            padding: 7,
            paddingBottom: '10px',
          }}
        >
          <Table.TextHeaderCell flex={2} textAlign="center">
            <TextTable>Validator</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell flex={1.5} textAlign="center">
            <TextTable>Unbondings</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>Rewards</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>Amount</TextTable>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          {delegations.length > 0 ? (
            delegations
          ) : (
            <Noitem text="No Delegations" />
          )}
        </Table.Body>
      </Table>
    </Pane>
  );
};

export default Heroes;
