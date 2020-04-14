import React, { useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { PocketCard } from '../components';
import { Copy, Dots } from '../../../components';
import { trimString, formatCurrency, getDelegator, exponentialToDecimal } from '../../../utils/utils';
import { getDrop } from '../../../utils/search/utils';

const imgLedger = require('../../../image/ledger.svg');

const Row = ({ title, value, marginBottomValue, fontSizeValue, ...props }) => (
  <Pane width="100%" display="flex" alignItems="center" {...props}>
    <Pane fontSize={fontSizeValue} marginBottom={marginBottomValue}>
      {value}
    </Pane>
    <Pane>{title}</Pane>
  </Pane>
);

function PubkeyCard({ pocket, ...props }) {
  const [gift, setGift] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const feachData = async () => {
      if (pocket.cosmos) {
        const dataDrop = await getDrop(pocket.cosmos.address);
        if (dataDrop !== 0) {
          setGift(dataDrop.gift);
        }
        setLoading(false);
      }
    };
    feachData();
  }, pocket);

  return (
    <PocketCard
      display="flex"
      flexDirection="column"
      paddingTop={15}
      paddingBottom={40}
      minHeight={pocket.keys === 'ledger' ? '200px' : '180px'}
      {...props}
    >
      {pocket.keys === 'ledger' && (
        <Row
          marginBottom={25}
          fontSizeValue="18px"
          flexDirection="column"
          alignItems="flex-start"
          value={
            <Pane display="flex" alignItems="center">
              <img
                style={{ width: 20, height: 20, marginRight: 5 }}
                src={imgLedger}
                alt="ledger"
              />
              <div>{trimString(pocket.pk, 6, 6)}</div>
            </Pane>
          }
          title="pubkey"
        />
      )}
      <Row
        marginBottom={20}
        marginBottomValue={5}
        alignItems="center"
        justifyContent="space-between"
        value={
          <Pane display="flex" alignItems="center">
            <Link to={`/network/euler/contract/${pocket.cyber.address}`}>
              <div>{trimString(pocket.cyber.address, 11, 6)}</div>
            </Link>
            <Copy text={pocket.cyber.address} />
          </Pane>
        }
        title={formatCurrency(pocket.cyber.amount, pocket.cyber.token)}
      />
      <Row
        marginBottom={20}
        marginBottomValue={5}
        alignItems="center"
        justifyContent="space-between"
        value={
          <Pane display="flex" alignItems="center">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.mintscan.io/account/${pocket.cosmos.address}`}
            >
              <div>{trimString(pocket.cosmos.address, 12, 6)}</div>
            </a>
            <Copy text={pocket.cosmos.address} />
          </Pane>
        }
        title={
          <div>
            {exponentialToDecimal(pocket.cosmos.amount.toPrecision(2))}{' '}
            {pocket.cosmos.token.toUpperCase()}
          </div>
        }
      />
      <Row
        marginBottomValue={5}
        alignItems="center"
        justifyContent="space-between"
        value={
          <Pane display="flex" alignItems="center">
            <div>{trimString(pocket.cyber.address, 11, 6)}</div>
          </Pane>
        }
        title={
          loading ? (
            <span>
              <Dots /> CYB
            </span>
          ) : (
            formatCurrency(gift, 'CYB')
          )
        }
      />
    </PocketCard>
  );
}

export default PubkeyCard;
