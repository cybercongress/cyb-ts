import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  IconStatus,
  ContainerPane,
  Item,
  Legend,
  Account,
  Dots,
} from '../../components';
import { VOTE_OPTION } from '../../utils/config';
import { getTableVoters, reduceTxsVoters } from '../../utils/governance';
import { ContainerGradientText } from '../portal/components';

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

const ProposalsIdDetailTableVoters = ({ proposalId, updateFunc, ...props }) => {
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
      const { pagination, txs } = response;
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
      const { txs } = response;

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
          <Table.TextCell textAlign="end">
            <Text fontSize="18px" color="#fff">
              {optionText(item.option)}
            </Text>
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
            padding: 7,
            paddingBottom: '10px',
          }}
          paddingLeft={20}
        >
          <Table.TextHeaderCell>
            <Text color="#fff" fontSize="17px">
              Voter
            </Text>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>
            <Text color="#fff" fontSize="17px">
              Vote Option
            </Text>
          </Table.TextHeaderCell>
        </Table.Head>

        <Table.Body
          style={{ backgroundColor: '#000', overflow: 'hidden', padding: 7 }}
        >
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
};

export default ProposalsIdDetailTableVoters;
