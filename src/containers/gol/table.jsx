import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { Load, Delegation, LifetimeHooks } from './discipline';

const TableDiscipline = ({ won, addressLedger, validatorAddress }) => {
  return (
    <Pane width="100%">
      <Pane textAlign="center" width="100%">
        <Text lineHeight="24px" color="#fff" fontSize="18px">
          Allocations of CYB rewards by discipline
        </Text>
      </Pane>
      <Table>
        <Table.Head
          style={{
            backgroundColor: '#000',
            borderBottom: '1px solid #ffffff80',
          }}
        >
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="18px" color="#fff">
              Discipline
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <Text fontSize="18px" color="#fff">
              CYB reward
            </Text>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          <Load addressLedger={addressLedger} won={won} />
          <Delegation validatorAddress={validatorAddress} won={won} />
          <LifetimeHooks validatorAddress={validatorAddress} won={won} />
        </Table.Body>
      </Table>
    </Pane>
  );
};

export default TableDiscipline;
