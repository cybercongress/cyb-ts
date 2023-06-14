import { UseInfiniteQueryResult } from '@tanstack/react-query';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  getDisplayAmount,
  getDisplayAmountReverce,
  getNowUtcTime,
  timeSince,
} from 'src/utils/utils';
import { ContainerGradientText, Dots } from 'src/components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AmountDenom } from 'src/containers/txs/Activites';
import { Link } from 'react-router-dom';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { FormatNumberTokens } from 'src/containers/nebula/components';
import rectangle from 'images/rectangle.svg';
import swapImg from 'images/sync-outline.svg';

function DataSwapTxs({ dataTxs }: { dataTxs: UseInfiniteQueryResult }) {
  const { traseDenom } = useIbcDenom();
  const { data, error, status, isFetching, fetchNextPage, hasNextPage } =
    dataTxs;

  let itemRows: React.ReactNode[] = [];

  if (data && traseDenom) {
    itemRows = data.pages.map((page) => (
      <React.Fragment key={page.page}>
        {page.data.map((item) => {
          const key = uuidv4();
          let timeAgoInMS = null;
          const time =
            getNowUtcTime() - Date.parse(item.transaction.block.timestamp);
          if (time > 0) {
            timeAgoInMS = time;
          }

          const { value } = item;

          const orderPrice = value.order_price;
          const tokenA = value.offer_coin.denom;
          const tokenAAmount = value.offer_coin.amount;
          const tokenB = value.demand_coin_denom;
          let tokenBAmount = 0;
          let counterPairAmount = 0;
          const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
          const [{ coinDecimals: coinDecimalsB }] = traseDenom(tokenB);

          if ([tokenA, tokenB].sort()[0] === tokenA) {
            const swapPrice = 1 / orderPrice;
            tokenBAmount = tokenAAmount * swapPrice;
            counterPairAmount = swapPrice;
          } else {
            tokenBAmount = tokenAAmount * orderPrice;
            const amountTokenA = getDisplayAmountReverce(1, coinDecimalsA);
            counterPairAmount = orderPrice * parseFloat(amountTokenA);
            // swapPrice = getDisplayAmount(swapPrice, coinDecimalsB);
          }

          return (
            <Link
              to={`/network/bostrom/tx/${item.transaction_hash}`}
              key={`${item.transaction_hash}_${key}`}
            >
              <ContainerGradientText
                status={item.transaction.success ? 'blue' : 'red'}
                userStyleContent={{ display: 'grid', gap: '10px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    color: '#777777',
                  }}
                >
                  <div style={{ display: 'flex', gap: 5 }}>
                    <img
                      src={swapImg}
                      alt="swapImg"
                      style={{ width: 20, height: 20 }}
                    />{' '}
                    <span>swap</span>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <FormatNumberTokens text={tokenA} value={1} />
                    <img
                      src={rectangle}
                      alt="img"
                      style={{
                        width: '20px',
                        height: '20px',
                        margin: '0 -2px',
                      }}
                    />
                    <FormatNumberTokens
                      text={tokenB}
                      value={counterPairAmount}
                      styleContainer={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    justifyItems: 'left',
                    alignItems: 'self-end',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gap: '10px',
                    }}
                  >
                    <AmountDenom
                      denom={tokenA}
                      amountValue={tokenAAmount}
                      styleValue={{ color: '#FF5C00' }}
                    />
                    <AmountDenom
                      denom={tokenB}
                      amountValue={tokenBAmount}
                      styleValue={{ color: '#76FF03' }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        color: '#777',
                        paddingBottom: 5,
                      }}
                    >
                      {timeSince(timeAgoInMS)} ago
                    </div>
                  </div>
                </div>
              </ContainerGradientText>
            </Link>
          );
        })}
      </React.Fragment>
    ));
  }

  const fetchNextPageFnc = () => {
    setTimeout(() => {
      fetchNextPage();
    }, 250);
  };

  return (
    <InfiniteScroll
      dataLength={Object.keys(itemRows).length}
      next={fetchNextPageFnc}
      style={{ display: 'grid', gap: '15px', marginTop: '20px' }}
      hasMore={hasNextPage}
      loader={
        isFetching && (
          <h4>
            Loading
            <Dots />
          </h4>
        )
      }
    >
      {status === 'loading' ? (
        <Dots />
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : itemRows.length > 0 ? (
        itemRows
      ) : null}
    </InfiniteScroll>
  );
}

export default DataSwapTxs;
