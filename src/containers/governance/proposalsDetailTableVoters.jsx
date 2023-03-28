import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Account,
  Dots,
  TextTable,
  ContainerGradientText,
} from '../../components';
import { getTableVoters, reduceTxsVoters } from '../../utils/governance';
import { timeSince, trimString } from '../../utils/utils';

const LIMIT = 50;

const optionText = (option) => {
  switch (option) {
    case 'VOTE_OPTION_YES':
      return 'yes';

    case 'VOTE_OPTION_NO':
      return 'no';

    case 'VOTE_OPTION_NO_WITH_VETO':
      return 'no with veto';

    case 'VOTE_OPTION_ABSTAIN':
      return 'abstain';

    default:
      return '';
  }
};

const optionTextColor = (option) => {
  switch (option) {
    case 'VOTE_OPTION_YES':
      return 'green';

    case 'VOTE_OPTION_NO':
      return 'red';

    case 'VOTE_OPTION_NO_WITH_VETO':
      return 'pink';

    default:
      return 'blue';
  }
};

function ProposalsIdDetailTableVoters({ proposalId, updateFunc, ...props }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allPage, setAllPage] = useState(0);

  useEffect(() => {
    getFirstItem();
  }, [proposalId, updateFunc]);

  const getFirstItem = async () => {
    let tempAllPage = 0;
    let firstItem = [];

    const response = await getTableVoters(proposalId, page, LIMIT);
    if (response && Object.keys(response).length > 0) {
      const { pagination, tx_responses: txs } = response;
      const { total } = pagination;
      tempAllPage = Math.ceil(total / LIMIT);
      firstItem = reduceTxsVoters(txs);
    }

    setItems(firstItem);
    setPage((item) => item + 1);
    setAllPage(tempAllPage);
    setLoading(false);
  };

  const fetchMoreData = async () => {
    let nextItem = [];

    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    const response = await getTableVoters(proposalId, page, LIMIT);
    if (response && Object.keys(response).length > 0) {
      const { tx_responses: txs } = response;

      nextItem = reduceTxsVoters(txs);
    }

    if (nextItem.length > 0) {
      setTimeout(() => {
        setItems((itemState) => [...itemState, ...nextItem]);
        setPage((itemPage) => itemPage + 1);
      }, 500);
    }
  };

  if (loading) {
    return <Dots />;
  }

  const rowsTable = items.map((item) => {
    const key = uuidv4();

    let timeAgoInMS = 0;
    const d = new Date().toUTCString();
    const time = Date.parse(d) - Date.parse(item.timestamp);
    if (time > 0) {
      timeAgoInMS = time;
    }

    return (
      <ContainerGradientText status={optionTextColor(item.option)}>
        <Table.Row
          borderBottom="none"
          paddingLeft={20}
          height={50}
          // isSelectable
          key={`${item.voter}_${key}`}
        >
          <Table.TextCell>
            <Text fontSize="18px" color="#fff">
              <Account address={item.voter} />
              {/* <Link to={`/network/bostrom/contract/${item.voter}`}>{item.voter}</Link> */}
            </Text>
          </Table.TextCell>
          <Table.TextCell textAlign="center">
            <TextTable>
              <Link to={`/network/bostrom/tx/${item.txhash}`}>
                {trimString(item.txhash, 6, 6)}
              </Link>
            </TextTable>
          </Table.TextCell>
          <Table.TextCell textAlign="end">
            <Text fontSize="18px" color="#fff">
              {optionText(item.option)}
            </Text>
          </Table.TextCell>
          <Table.TextCell textAlign="end">
            <TextTable>{timeSince(timeAgoInMS)} ago</TextTable>
          </Table.TextCell>
        </Table.Row>
      </ContainerGradientText>
    );
  });

  return (
    <Pane>
      <Table>
        <Table.Head
          style={{
            backgroundColor: '#000',
            border: 'none',
            marginTop: '10px',
            paddingBottom: '10px',
          }}
          paddingLeft={20}
        >
          <Table.TextHeaderCell textAlign="center">
            <Text color="#fff" fontSize="17px">
              voter
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>tx</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="end">
            <Text color="#fff" fontSize="17px">
              vote option
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="end">
            <TextTable>timestamp</TextTable>
          </Table.TextHeaderCell>
        </Table.Head>

        <Table.Body style={{ backgroundColor: '#000', overflow: 'hidden' }}>
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={page !== allPage}
            style={{ display: 'grid', gap: '15px' }}
            loader={
              <h4>
                Loading
                <Dots />
              </h4>
            }
          >
            {items.length > 0 ? rowsTable : ''}
          </InfiniteScroll>
        </Table.Body>
      </Table>
    </Pane>
  );
}

export default ProposalsIdDetailTableVoters;
