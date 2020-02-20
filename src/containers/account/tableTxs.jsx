import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Pane, Text, TableEv as Table, Icon, Tooltip } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { formatValidatorAddress, formatNumber } from '../../utils/utils';
import { CardTemplate, MsgType, Loading, TextTable } from '../../components';
import Noitem from './noItem';

const dateFormat = require('dateformat');
const imgDropdown = require('../../image/arrow-dropdown.svg');
const imgDropup = require('../../image/arrow-dropup.svg');
const statusTrueImg = require('../../image/ionicons_svg_ios-checkmark-circle.svg');
const statusFalseImg = require('../../image/ionicons_svg_ios-close-circle.svg');

const TableTxs = ({ data, type, accountUser }) => {
  const containerReference = useRef();
  const [itemsToShow, setItemsToShow] = useState(10);

  const setNextDisplayedPalettes = useCallback(() => {
    setItemsToShow(itemsToShow + 10);
  }, [itemsToShow, setItemsToShow]);

  const displayedPalettes = useMemo(() => data.slice(0, itemsToShow), [
    itemsToShow,
  ]);

  const validatorRows = displayedPalettes.map(item => (
    <Table.Row
      // borderBottom="none"
      paddingX={0}
      paddingY={5}
      borderBottom="1px solid #3ab79340"
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
          <Link to={`/network/euler-5/tx/${item.txhash}`}>
            {formatValidatorAddress(item.txhash, 6, 6)}
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
          {item.messages.map((items, i) => (
            <MsgType key={`${item.txhash}_${i}`} type={items.type} />
          ))}
          {/* <MsgType
            type={
              item.cyberlink !== null
                ? 'cyberd/Link'
                : item.message !== null
                ? accountUser === item.subject
                  ? item.message.type
                  : 'Receive'
                : 'Fail'
            }
          /> */}
        </TextTable>
      </Table.TextCell>
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
            height: '30vh',
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
              <Noitem text={`No txs ${type}`} />
            )}
          </InfiniteScroll>
        </div>
      </Table.Body>
    </Table>
  );
};

export default TableTxs;
