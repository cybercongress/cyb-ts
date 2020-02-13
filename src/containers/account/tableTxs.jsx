import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { formatValidatorAddress, formatNumber } from '../../utils/utils';
import { CardTemplate, MsgType, Loading } from '../../components';
import Noitem from './noItem';
import InfiniteScroll from 'react-infinite-scroller';

const dateFormat = require('dateformat');
const imgDropdown = require('../../image/arrow-dropdown.svg');
const imgDropup = require('../../image/arrow-dropup.svg');
const statusTrueImg = require('../../image/ionicons_svg_ios-checkmark-circle.svg');
const statusFalseImg = require('../../image/ionicons_svg_ios-close-circle.svg');

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
    <Table.Row borderBottom="none" display="flex" key={item.txhash}>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Link to={`/txs/${item.txhash}`}>
            {formatValidatorAddress(item.txhash, 6, 6)}
          </Link>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell flex={0.5} textAlign="center">
        <TextTable>
          <img
            style={{ width: '20px', height: '20px', marginRight: '5px' }}
            src={item.transaction.code === 0 ? statusTrueImg : statusFalseImg}
            alt="statusImg"
          />
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <MsgType
            type={accountUser === item.subject ? item.type : 'Receive'}
          />
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          {dateFormat(item.timestamp, 'dd/mm/yyyy, hh:MM:ss tt "UTC"')}
        </TextTable>
      </Table.TextCell>
    </Table.Row>
  ));

  return (
    <div>
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
            <TextTable>tx</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell flex={0.7} textAlign="center">
            <TextTable flex={0.5}>status</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>type</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>timestamp</TextTable>
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
    </div>
  );
};

export default TableTxs;
