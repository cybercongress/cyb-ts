import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, TableEv as Table, Text, Tooltip } from '@cybercongress/gravity';
import { LinkWindow, TextTable } from '../../components';
import { trimString, formatNumber, formatCurrency } from '../../utils/utils';
import { CYBER } from '../../utils/config';

const statusMapping = ['Believed', 'Blessed', 'Unblessed'];

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

function TableEvangelists({ data, blessed }) {
  try {
    const rowTableEvangelists = Object.keys(data)
      .filter(keys =>
        blessed
          ? parseInt(data[keys].status, 10) === 1
          : parseInt(data[keys].status, 10) !== 1
      )
      .map(key => {
        return (
          <Table.Row
            borderBottom="none"
            key={key}
            display="flex"
            marginBottom={10}
            minHeight="48px"
            height="fit-content"
            paddingY={5}
            paddingX={5}
          >
            <Table.TextCell textAlign="center">
              <TextTable>
                <Link to={`/network/euler/contract/${key}`}>
                  {data[key].nickname}
                </Link>
              </TextTable>
            </Table.TextCell>
            <Table.TextCell flex={0.7} textAlign="center">
              <TextTable>{statusMapping[data[key].status]}</TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="end">
              <TextTable>{formatNumber(data[key].amount, 3)} ATOMs</TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="end">
              <Tooltip
                position="bottom"
                content={`${formatNumber(
                  Math.floor(data[key].estimation)
                )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
              >
                <TextTable>
                  {formatCurrency(data[key].estimation, 'CYB', 0)}
                </TextTable>
              </Tooltip>
            </Table.TextCell>
            <Table.TextCell textAlign="center">
              <TextTable>
                <LinkWindow to={`https://keybase.io/${data[key].keybase}`}>
                  {data[key].keybase}
                </LinkWindow>
              </TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="center">
              <TextTable>
                <LinkWindow to={`https://github.com/${data[key].github}`}>
                  {data[key].github}
                </LinkWindow>
              </TextTable>
            </Table.TextCell>
          </Table.Row>
        );
      });
    return (
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
          <Table.TextHeaderCell textAlign="center">
            <TextTable>nickname</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell flex={0.7} textAlign="center">
            <TextTable>status</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>donations</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>reward</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>keybase</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>github</TextTable>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          {rowTableEvangelists.length > 0 ? (
            rowTableEvangelists
          ) : (
            <Noitem text="No Evangelists" />
          )}
        </Table.Body>
      </Table>
    );
  } catch (error) {
    return <div>oops..</div>;
  }
}

export default TableEvangelists;
