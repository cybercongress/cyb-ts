import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  Pane,
  Text,
  TableEv as Table,
  Icon,
  Tooltip,
} from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import {
  trimString,
  formatNumber,
  formatCurrency,
} from '../../utils/utils';
import { CardTemplate, MsgType, Loading, TextTable } from '../../components';
import Noitem from './noItem';
import { CYBER } from '../../utils/config';

const dateFormat = require('dateformat');
const imgDropdown = require('../../image/arrow-dropdown.svg');
const imgDropup = require('../../image/arrow-dropup.svg');
const statusTrueImg = require('../../image/ionicons_svg_ios-checkmark-circle.svg');
const statusFalseImg = require('../../image/ionicons_svg_ios-close-circle.svg');

const TableTxs = ({ data, type, accountUser, amount }) => {
  const containerReference = useRef();
  const [itemsToShow, setItemsToShow] = useState(10);

  const setNextDisplayedPalettes = useCallback(() => {
    setItemsToShow(itemsToShow + 10);
  }, [itemsToShow, setItemsToShow]);

  const displayedPalettes = useMemo(() => data.slice(0, itemsToShow), [
    itemsToShow,
  ]);

  const validatorRows = displayedPalettes.map((item, index) => (
    <Table.Row
      // borderBottom="none"
      paddingX={0}
      paddingY={5}
      borderTop={index === 0 ? 'none' : '1px solid #3ab79340'}
      borderBottom="none"
      display="flex"
      minHeight="48px"
      height="fit-content"
      key={item.txhash}
    >
      <Table.TextCell flex={0.5} textAlign="center">
        <TextTable>
          <img
            style={{ width: '20px', height: '20px', marginRight: '5px' }}
            src={item.code === 0 ? statusTrueImg : statusFalseImg}
            alt="statusImg"
          />
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Link to={`/network/euler/tx/${item.txhash}`}>
            {trimString(item.txhash, 6, 6)}
          </Link>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell flex={1.3} textAlign="center">
        <TextTable>
          {dateFormat(item.timestamp, 'dd/mm/yyyy, HH:MM:ss')}
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable display="flex" flexDirection="column">
        {item.messages.length > 4 ? (
            <Pane display="flex" alignItems="center">
              <MsgType
                key={item.messages[0].txhash}
                type={item.messages[0].type}
              />
              <div style={{ marginLeft: '5px' }}>
                ({item.messages.length} messages)
              </div>
            </Pane>
          ) : (
            item.messages.map((items, i) => {
              let typeTx = items.type;
              if (
                typeTx === 'cosmos-sdk/MsgSend' &&
                items.value.to_address === accountUser
              ) {
                typeTx = 'Receive';
              }
              return <MsgType key={i} type={typeTx} />;
            })
          )}
        </TextTable>
      </Table.TextCell>
      {amount && (
        <Table.TextCell textAlign="end">
          {item.messages.map((items, i) => (
            <Tooltip
              position="bottom"
              key={i}
              content={`${formatNumber(
                Math.floor(items.value.amount.amount)
              )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
            >
              <TextTable
                color={
                  items.type === 'cosmos-sdk/MsgDelegate'
                    ? '#4ed6ae'
                    : '#f4516b'
                }
              >
                {items.type === 'cosmos-sdk/MsgDelegate'
                  ? `+ ${formatCurrency(
                      items.value.amount.amount,
                      CYBER.DENOM_CYBER.toUpperCase(),
                      0
                    )}`
                  : `- ${formatCurrency(
                      items.value.amount.amount,
                      CYBER.DENOM_CYBER.toUpperCase(),
                      0
                    )}`}
              </TextTable>
            </Tooltip>
          ))}
        </Table.TextCell>
      )}
    </Table.Row>
  ));

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
        <Table.TextHeaderCell flex={0.5} textAlign="center">
          <TextTable>status</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>tx</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={1.3} textAlign="center">
          <TextTable>
            timestamp{' '}
            <Tooltip content="UTC" position="bottom">
              <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
            </Tooltip>
          </TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>type</TextTable>
        </Table.TextHeaderCell>
        {amount && (
          <Table.TextHeaderCell textAlign="center">
            <TextTable>amount</TextTable>
          </Table.TextHeaderCell>
        )}
      </Table.Head>
      <Table.Body
        style={{
          backgroundColor: '#000',
          overflowY: 'hidden',
          padding: 7,
        }}
      >
        <div
          style={{
            height: data.length > 5 ? '30vh' : 'auto',
            overflow: 'auto',
          }}
          ref={containerReference}
        >
          <InfiniteScroll
            hasMore={itemsToShow < data.length}
            loader={<Loading />}
            pageStart={0}
            useWindow={false}
            loadMore={setNextDisplayedPalettes}
            getScrollParent={() => containerReference.current}
          >
            {data.length > 0 ? (
              validatorRows
            ) : (
              <Noitem text={`No txs ${type || ' '}`} />
            )}
          </InfiniteScroll>
        </div>
      </Table.Body>
    </Table>
  );
};

export default TableTxs;
