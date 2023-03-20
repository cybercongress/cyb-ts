import React from 'react';
import { TableEv as Table } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { formatNumber, formatCurrency } from '../../../utils/utils';
import { FormatNumber, Dots, NumberCurrency } from '../../../components';
import { TextTable, StatusTooltip } from './ui';
import { CYBER } from '../../../utils/config';

const imgSearch = require('../../../image/ionicons_svg_ios-help-circle-outline.svg');

function TableItem({
  item,
  staking,
  commission,
  selected,
  selectValidators,
  mobile,
  index,
  showJailed,
  loadingSelf,
  loadingBond,
}) {
  return (
    <Table.Row
      borderBottom="none"
      // backgroundColor={index === selectedIndex ? '#ffffff29' : '#000'}
      boxShadow={selected ? '0px 0px 7px #3ab793db' : ''}
      //   className='validators-table-row'
      onSelect={selectValidators}
      isSelectable
    >
      <Table.TextCell
        paddingX={5}
        textAlign="start"
        flexBasis={mobile ? 30 : 60}
        flex="none"
        isNumber
      >
        <TextTable>{index}</TextTable>
      </Table.TextCell>
      <Table.TextCell position="relative" paddingRight={20} paddingLeft={5}>
        <TextTable width="100%">
          <StatusTooltip status={item.status} />
          <span
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              color: '#36d6ae',
            }}
          >
            <Link to={`/network/bostrom/hero/${item.operatorAddress}`}>
              {item.description.moniker}
            </Link>
          </span>
          <Link
            style={{
              position: 'absolute',
              right: 0,
            }}
            to={`/search/${item.description.moniker}`}
          >
            <img
              src={imgSearch}
              alt="img"
              style={{
                width: 15,
              }}
            />
          </Link>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell paddingX={5} flex={0.7} textAlign="end">
        <TextTable>
          <FormatNumber number={commission} fontSizeDecimal={11.5} />
          &ensp;%
        </TextTable>
      </Table.TextCell>
      <Table.TextCell flex={1.1} paddingX={5} textAlign="end" isNumber>
        <TextTable>
          <TextTable>
            <NumberCurrency amount={item.tokens} />
          </TextTable>
        </TextTable>
      </Table.TextCell>
      {!mobile && (
        <>
          <Table.TextCell paddingX={5} flex={0.5} textAlign="end" isNumber>
            <TextTable>
              <FormatNumber number={staking} fontSizeDecimal={11.5} />
              &ensp;%
            </TextTable>
          </Table.TextCell>
          <Table.TextCell flex={0.5} paddingX={5} textAlign="end">
            <TextTable>
              {loadingSelf ? (
                <Dots />
              ) : (
                <FormatNumber
                  number={item.shares !== undefined ? item.shares : 0}
                  fontSizeDecimal={11.5}
                />
              )}
              &ensp;%
            </TextTable>
          </Table.TextCell>
          <Table.TextCell paddingX={5} textAlign="end" isNumber>
            {loadingBond ? (
              <Dots />
            ) : (
              <TextTable>
                <NumberCurrency
                  amount={parseFloat(
                    item.delegation !== undefined ? item.delegation.amount : 0
                  )}
                />
              </TextTable>
            )}
          </Table.TextCell>
        </>
      )}
      {showJailed && (
        <Table.TextCell paddingX={5} flex={0.8} textAlign="end" isNumber>
          <TextTable>{item.unbondingHeight}</TextTable>
        </Table.TextCell>
      )}
    </Table.Row>
  );
}

export default TableItem;
