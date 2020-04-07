import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { PocketCard } from '../components';
import { Copy } from '../../../components';
import { trimString, formatCurrency } from '../../../utils/utils';

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
  return (
    <PocketCard
      display="flex"
      flexDirection="column"
      paddingTop={15}
      paddingBottom={40}
      height="200px"
      {...props}
    >
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
      <Row
        marginBottom={20}
        marginBottomValue={5}
        alignItems="center"
        justifyContent="space-between"
        value={
          <Pane display="flex" alignItems="center">
            <Link to={`/network/euler-5/contract/${pocket.cyber.address}`}>
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
            {pocket.cosmos.amount.toPrecision(2)} {pocket.cosmos.token}
          </div>
        }
      />
    </PocketCard>
  );
}

export default PubkeyCard;
