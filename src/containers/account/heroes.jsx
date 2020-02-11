import React from 'react';
import { Pane, Text, Tooltip, TableEv as Table } from '@cybercongress/gravity';
import { CardTemplate, Account } from '../../components';
import { formatNumber, formatCurrency } from '../../utils/utils';
import { CYBER } from '../../utils/config';

const noitem = require('../../image/noitem.svg');

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
    fontSize={`${fontSize || 13}px`}
    color={`${color || '#fff'}`}
    display={`${display || 'inline-flex'}`}
    {...props}
  >
    {children}
  </Text>
);

const Heroes = ({ data, ...props }) => {
  const delegations = data.delegations.map(item => (
    <Table.Row
      borderBottom="none"
      key={item.validator_address}
      display="flex"
      marginBottom={10}
    >
      {' '}
      <Table.TextCell flex={1} textAlign="start">
        <TextTable>
          <Account address={item.validator_address} />
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="end">
        <Tooltip
          content={`${formatNumber(
            parseFloat(item.balance)
          )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
          position="bottom"
        >
          <TextTable>
            {formatCurrency(
              parseFloat(item.balance),
              CYBER.DENOM_CYBER.toUpperCase()
            )}
          </TextTable>
        </Tooltip>
      </Table.TextCell>
    </Table.Row>
  ));

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
          <Table.TextHeaderCell flex={1} textAlign="center">
            <TextTable>Validator</TextTable>
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
