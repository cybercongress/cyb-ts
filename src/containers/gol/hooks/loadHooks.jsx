import { useEffect, useState } from 'react';
import { getGraphQLQuery, getIndexStats } from '../../../utils/search/utils';

const GET_CHARACTERS = `
query MyQuery {
  karma_view(order_by: {karma: desc}) {
    karma
    subject
  }
  karma_view_aggregate {
    aggregate {
      count
    }
  }
}
`;

const QueryAddress = address =>
  ` query MyQuery {
  karma_view(where: {subject: {_eq: "${address}"}}) {
    karma
    subject
  }
}`;

const useLoad = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sumKarma, setSumKarma] = useState(0);

  useEffect(() => {
    const feachData = async () => {
      let address = [];
      const itemsData = [];
      let karma = 0;
      const localStorageStory = await localStorage.getItem('ledger');
      if (localStorageStory !== null) {
        address = JSON.parse(localStorageStory);
        const dataLocal = await getGraphQLQuery(QueryAddress(address.bech32));
        if (Object.keys(dataLocal.karma_view).length > 0) {
          dataLocal.karma_view[0].local = true;
          itemsData.push(...dataLocal.karma_view);
        }
      }

      const dataGraphQLQuery = await getGraphQLQuery(GET_CHARACTERS);
      const responseIndexStats = await getIndexStats();

      if (Object.keys(dataGraphQLQuery.karma_view).length > 0) {
        if (responseIndexStats !== null) {
          karma = responseIndexStats.totalKarma;
        }
        itemsData.push(...dataGraphQLQuery.karma_view);
      }
      setData(itemsData);
      setSumKarma(karma);
      setLoading(false);
    };
    feachData();
  }, []);

  return { data, loading, sumKarma };
};

export default useLoad;
