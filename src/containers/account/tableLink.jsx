import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { formatValidatorAddress, formatNumber } from '../../utils/utils';
import { CardTemplate, Cid, Loading } from '../../components';
import Noitem from './noItem';

const dateFormat = require('dateformat');

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

const TableLink = ({ data }) => {
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
          <Link to={`/network/euler-5/tx/${item.txhash}`}>
            {formatValidatorAddress(item.txhash, 6, 6)}
          </Link>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          {dateFormat(item.timestamp, 'dd/mm/yyyy, hh:MM:ss tt "UTC"')}
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Cid cid={item.object_to}>
            {formatValidatorAddress(item.object_to, 6, 6)}
          </Cid>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Cid cid={item.object_from}>
            {formatValidatorAddress(item.object_from, 6, 6)}
          </Cid>
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
            paddingBottom: '10px',
          }}
        >
          <Table.TextHeaderCell textAlign="center">
            <TextTable>tx</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>timestamp</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>from</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>to</TextTable>
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
                <Noitem text="No cyberLinks" />
              )}
            </InfiniteScroll>
          </div>
        </Table.Body>
      </Table>
    </div>
  );
};

export default TableLink;
