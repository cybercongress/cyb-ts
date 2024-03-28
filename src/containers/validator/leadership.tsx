
import TableTxs from '../../pages/robot/_refactor/account/component/tableTxs';
import Loader2 from 'src/components/ui/Loader2';
import { useLeadershipQuery } from 'src/generated/graphql';
import { useState } from 'react';

const LIMIT = 10;

function Leadership({ accountUser }: { accountUser: string }) {
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, fetchMore } = useLeadershipQuery({
    variables: {
      limit: LIMIT,
      offset: 0,
      valAddress: accountUser,
    },
  });

  const { _transaction: transaction } = data || {};

  const fetchNextData = () => {
    fetchMore({
      variables: {
        offset: data?._transaction.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        setHasMore(fetchMoreResult._transaction.length > 0);

        return {
          ...prev,
         _transaction: [...prev._transaction, ...fetchMoreResult._transaction],
        };
      },
    });
  };

  return (
    <div>
      {loading ? (
        <Loader2 />
      ) : transaction ? (
        <TableTxs
          accountUser={accountUser}
          data={transaction}
          hasMore={hasMore}
          fetchNextData={fetchNextData}
        />
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        'No data'
      )}
    </div>
  );
}

export default Leadership;
