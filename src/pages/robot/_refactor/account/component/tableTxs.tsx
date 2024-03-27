import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Pane, TableEv as Table } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { trimString, formatNumber } from '../../../../../utils/utils';
import {
  NoItems,
  MsgType,
  Dots,
  TextTable,
  NumberCurrency,
} from '../../../../../components';

const statusTrueImg = require('src/image/ionicons_svg_ios-checkmark-circle.svg');
const statusFalseImg = require('src/image/ionicons_svg_ios-close-circle.svg');

function TableTxs({ data, type, accountUser, amount, fetchNextData, hasMore }) {
  const setNextDisplayedPalettes = useCallback(() => {
    setTimeout(() => {
      if (fetchNextData) {
        fetchNextData();
      }
    }, 250);
  }, [fetchNextData]);

  const validatorRows = data.map((item, index) => (
    <Table.Row
      paddingX={0}
      paddingY={5}
      borderTop={index === 0 ? 'none' : '1px solid #3ab79340'}
      borderBottom="none"
      display="flex"
      minHeight="48px"
      height="fit-content"
      key={`${item.hash}_${uuidv4()}`}
    >
      <Table.TextCell flex={0.5} textAlign="center">
        <TextTable>
          <img
            style={{ width: '20px', height: '20px', marginRight: '5px' }}
            src={item.success ? statusTrueImg : statusFalseImg}
            alt="statusImg"
          />
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          <Link to={`/network/bostrom/tx/${item.hash}`}>
            {trimString(item.hash, 6, 6)}
          </Link>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell flex={1.3} textAlign="center">
        {item.height && <TextTable>{formatNumber(item.height)}</TextTable>}
      </Table.TextCell>
      <Table.TextCell flex={1.5} textAlign="center">
        {item.messages && (
          <TextTable display="flex" flexDirection="column">
            {item.messages.length > 4 ? (
              <Pane display="flex" alignItems="center">
                <MsgType
                  type={
                    item.messages[0]['@type'].includes('MsgSend')
                      ? 'cosmos-sdk/MsgMultiSend'
                      : item.messages[0]['@type']
                  }
                />
                <div style={{ marginLeft: '5px', color: '#36d6ae' }}>
                  +{item.messages.length}
                </div>
              </Pane>
            ) : (
              item.messages.map((items, i) => {
                let typeTx = items['@type'];
                if (
                  typeTx.includes('MsgSend') &&
                  items.to_address === accountUser
                ) {
                  typeTx = 'Receive';
                }
                return <MsgType key={i} type={typeTx} />;
              })
            )}
          </TextTable>
        )}
      </Table.TextCell>
      {amount && (
        <Table.TextCell flex={1.5} textAlign="end">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            {item.messages.map((items, i) => (
              // <Tooltip
              //   position="bottom"
              //   key={i}
              //   content={`${formatNumber(
              //     Math.floor(items.value.amount.amount)
              //   )} ${BASE_DENOM.toUpperCase()}`}
              // >
              <TextTable
                key={i}
                color={
                  items['@type'].includes('MsgDelegate') ? '#4ed6ae' : '#f4516b'
                }
              >
                {items['@type'].includes('MsgDelegate') &&
                  items.amount?.amount && (
                    <>
                      + <NumberCurrency amount={items.amount.amount} />
                    </>
                  )}

                {items['@type'].includes('MsgUndelegate') &&
                  items.amount?.amount && (
                    <>
                      - <NumberCurrency amount={items.amount.amount} />
                    </>
                  )}
              </TextTable>
              // </Tooltip>
            ))}
          </div>
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
            height{' '}
            {/* <Tooltip content="UTC" position="bottom">
              <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
            </Tooltip> */}
          </TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={1.5} textAlign="center">
          <TextTable>type</TextTable>
        </Table.TextHeaderCell>
        {amount && (
          <Table.TextHeaderCell flex={1.5} textAlign="center">
            <TextTable>amount</TextTable>
          </Table.TextHeaderCell>
        )}
      </Table.Head>
      <Table.Body
        style={{
          backgroundColor: '#000',
          overflowY: 'hidden',
          padding: 7,
          paddingTop: 25,
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={setNextDisplayedPalettes}
          hasMore={hasMore}
          loader={
            <h4>
              Loading
              <Dots />
            </h4>
          }
          refreshFunction={setNextDisplayedPalettes}
        >
          {data.length > 0 ? (
            validatorRows
          ) : (
            <NoItems text={`No txs ${type || ' '}`} />
          )}
        </InfiniteScroll>
      </Table.Body>
    </Table>
  );
}

export default TableTxs;
