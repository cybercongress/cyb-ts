import { Link } from 'react-router-dom';
import { Account, SearchItem } from 'src/components';
import {
  PATTERN_CYBER,
  PATTERN_CYBER_VALOPER,
  PATTERN_TX,
  PATTERN_BLOCK,
} from 'src/utils/config';
import { trimString, formatNumber } from 'src/utils/utils';
import { Pane } from '@cybercongress/gravity';
import { v4 as uuidv4 } from 'uuid';

const textPreviewSparkApp = (text, value) => (
  <div style={{ display: 'grid', gap: '10px' }}>
    <div>{text}</div>
    <div style={{ fontSize: '18px', color: '#36d6ae' }}>{value}</div>
  </div>
);

function FirstItems({ query }) {
  const searchItems = [];

  if (query.match(PATTERN_CYBER)) {
    const key = uuidv4();
    searchItems.push(
      <Pane
        key={key}
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="-2px"
      >
        <Link className="SearchItem" to={`/network/bostrom/contract/${query}`}>
          <SearchItem hash={`${query}_PATTERN_CYBER`} status="sparkApp">
            {textPreviewSparkApp(
              'Explore details of contract',
              <Account avatar address={query} />
            )}
          </SearchItem>
        </Link>
      </Pane>
    );
  }

  if (query.match(PATTERN_CYBER_VALOPER)) {
    const key = uuidv4();
    searchItems.push(
      <Pane
        key={key}
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="-2px"
      >
        <Link className="SearchItem" to={`/network/bostrom/hero/${query}`}>
          <SearchItem hash={`${query}_PATTERN_CYBER_VALOPER`} status="sparkApp">
            {textPreviewSparkApp(
              'Explore details of hero',
              <Account address={query} />
            )}
          </SearchItem>
        </Link>
      </Pane>
    );
  }

  if (query.match(PATTERN_TX)) {
    const key = uuidv4();
    searchItems.push(
      <Pane
        key={key}
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="-2px"
      >
        <Link className="SearchItem" to={`/network/bostrom/tx/${query}`}>
          <SearchItem hash={`${query}_PATTERN_TX`} status="sparkApp">
            {textPreviewSparkApp(
              'Explore details of tx',
              trimString(query, 4, 4)
            )}
          </SearchItem>
        </Link>
      </Pane>
    );
  }

  if (query.match(PATTERN_BLOCK)) {
    const key = uuidv4();
    searchItems.push(
      <Pane
        key={key}
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="-2px"
      >
        <Link className="SearchItem" to={`/network/bostrom/block/${query}`}>
          <SearchItem hash={`${query}_PATTERN_BLOCK`} status="sparkApp">
            {textPreviewSparkApp(
              'Explore details of block ',
              formatNumber(parseFloat(query))
            )}
          </SearchItem>
        </Link>
      </Pane>
    );
  }

  return searchItems;
}

export default FirstItems;
