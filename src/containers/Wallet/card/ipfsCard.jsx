import React, { useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { PocketCard } from '../components';
import { Copy, Dots } from '../../../components';
import { trimString, formatCurrency, formatNumber } from '../../../utils/utils';
import { getDrop } from '../../../utils/search/utils';

import imgIpfs from '../../../image/ipfs-logo.svg';

const PREFIXES = [
  {
    prefix: 'T',
    power: 1024 * 10 ** 9,
  },
  {
    prefix: 'G',
    power: 1024 * 10 ** 6,
  },
  {
    prefix: 'M',
    power: 1024 * 10 ** 3,
  },
  {
    prefix: 'K',
    power: 1024,
  },
];

const Row = ({ title, value, marginBottomValue, fontSizeValue, ...props }) => (
  <Pane width="100%" display="flex" alignItems="center" {...props}>
    <Pane fontSize={fontSizeValue} marginBottom={marginBottomValue}>
      {value}
    </Pane>
    <Pane>{title}</Pane>
  </Pane>
);

function IpfsCard({ storageManager, ipfsId, ...props }) {
  console.log('storageManager.usage :>> ', storageManager.usage);
  return (
    <PocketCard display="flex" flexDirection="column" {...props}>
      <Row
        marginBottom={25}
        fontSizeValue="18px"
        flexDirection="column"
        alignItems="flex-start"
        value={
          <Pane display="flex" alignItems="center">
            <img
              style={{ width: 20, height: 20, marginRight: 5 }}
              src={imgIpfs}
              alt="ipfs-logo"
            />
            <div>{trimString(ipfsId.publicKey, 6, 6)}</div>
          </Pane>
        }
        title="pubkey"
      />
      <Row
        marginBottom={10}
        marginBottomValue={5}
        justifyContent="space-between"
        alignItems="baseline"
        value={
          <Pane display="flex" alignItems="center">
            {ipfsId?.id?.string && (
              <>
                <div>{trimString(ipfsId.id.string, 6, 6)}</div>
                <Copy text={ipfsId.id.string} />
              </>
            )}
          </Pane>
        }
        title={formatCurrency(storageManager.usage, 'B', 2, PREFIXES)}
      />
    </PocketCard>
  );
}

export default IpfsCard;
