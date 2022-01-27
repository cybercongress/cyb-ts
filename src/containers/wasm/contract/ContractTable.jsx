import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LinkCreator } from '../ui/ui';
import { NoItems, Dots } from '../../../components';
import { trimString, formatNumber } from '../../../utils/utils';

const styleLable = {
  textAlign: 'start',
  maxWidth: '200px',
  textOverflow: 'ellipsis',
  overflowX: 'hidden',
  whiteSpace: 'nowrap',
};

const ContractTable = ({ contracts, count, setOffset }) => {
  const setNextDisplayedPalettes = useCallback(() => {
    setTimeout(() => {
      setOffset((itemsState) => itemsState + 1);
    }, 250);
  }, []);

  const itemTable = contracts.map((item) => {
    const { address, fees, gas, label, creator, tx } = item;
    return (
      <tr style={{ textAlign: 'center' }} key={address}>
        <td>
          <div className="name-column" style={styleLable} title={label}>
            {label}
          </div>
        </td>
        <td>
          <Link to={`/contracts/${address}`}>{trimString(address, 10, 8)}</Link>
        </td>
        <td>
          <LinkCreator address={creator}>
            {trimString(creator, 10, 8)}
          </LinkCreator>
        </td>
        <td style={{ textAlign: 'end' }}>{formatNumber(tx)}</td>
        <td style={{ textAlign: 'end' }}>{formatNumber(gas)}</td>
        <td style={{ textAlign: 'end' }}>{formatNumber(fees)}</td>
      </tr>
    );
  });

  return (
    <InfiniteScroll
      dataLength={contracts.length}
      next={setNextDisplayedPalettes}
      hasMore={count > contracts.length}
      loader={
        <h4>
          Loading
          <Dots />
        </h4>
      }
    >
      {contracts.length > 0 ? (
        <table
          style={{
            borderSpacing: '5px 16px',
            borderCollapse: 'separate',
          }}
          className="table"
        >
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Owner</th>
              <th scope="col">Txs</th>
              <th scope="col">Gas</th>
              <th scope="col">Fees</th>
            </tr>
          </thead>

          <tbody>{itemTable}</tbody>
        </table>
      ) : (
        <NoItems text="No cyberLinks" />
      )}
    </InfiniteScroll>
  );
};

export default ContractTable;
