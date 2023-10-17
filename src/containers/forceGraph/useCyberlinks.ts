import { useEffect, useState } from 'react';
import { getGraphQLQuery } from 'src/utils/search/utils';

// TODO: refactor and maybe delete
function useCyberlinks(address?: string) {
  const [data, setItems] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const limit = 1024;
    let where;

    const fetchData = async () => {
      if (address) {
        where = `{neuron: {_eq: "${address}"}}`;
      } else {
        where = '{}';
      }
      const GET_CYBERLINKS = `
          query Cyberlinks {
            cyberlinks(limit: ${String(
              limit
            )}, order_by: {height: desc}, where: ${where}) {
              particle_from
              particle_to
              neuron
              transaction_hash
            }
          }
          `;
      const { cyberlinks } = await getGraphQLQuery(GET_CYBERLINKS);
      const from = cyberlinks.map((a) => a.particle_from);
      const to = cyberlinks.map((a) => a.particle_to);
      const set = new Set(from.concat(to));
      const object = [];
      set.forEach((value) => {
        object.push({ id: value });
      });

      for (let i = 0; i < cyberlinks.length; i++) {
        cyberlinks[i] = {
          source: cyberlinks[i].particle_from,
          target: cyberlinks[i].particle_to,
          name: cyberlinks[i].transaction_hash,
          subject: cyberlinks[i].subject,
          // curvative: getRandomInt(20, 500) / 1000,
        };
      }

      setItems({
        nodes: object,
        links: cyberlinks,
      });
      setLoading(false);
    };
    fetchData();
  }, [address]);

  return {
    data,
    loading,
  };
}

export default useCyberlinks;
