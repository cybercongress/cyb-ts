import { useGetRumorsQuery } from 'src/generated/graphql';
import { useState } from 'react';
import TableTxs from '../../pages/robot/_refactor/account/component/tableTxs';
import { Loading, NoItems } from '../../components';

const LIMIT = 10;

function Rumors({ accountUser }: { accountUser: string }) {
  const [hasMore, setHasMore] = useState(true);
  const {
    loading,
    error,
    data: dataTxs,
    fetchMore,
  } = useGetRumorsQuery({
    variables: {
      limit: LIMIT,
      offset: 0,
      valAddress: accountUser,
    },
  });

  const fetchNextData = () => {
    fetchMore({
      variables: {
        offset: dataTxs?.transaction.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        setHasMore(fetchMoreResult.transaction.length > 0);

        return {
          ...prev,
          transaction: [...prev.transaction, ...fetchMoreResult.transaction],
        };
      },
    });
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : dataTxs ? (
        <TableTxs
          accountUser={accountUser}
          amount
          data={dataTxs.transaction}
          fetchNextData={fetchNextData}
          hasMore={hasMore}
        />
      ) : error ? (
        <>{JSON.stringify(error)}</>
      ) : (
        <NoItems text="No data" />
      )}
    </div>
  );
}

export default Rumors;
