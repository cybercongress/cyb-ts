import gql from 'graphql-tag';
import { useMemo } from 'react';
import { useQuery } from 'react-apollo';

// TODO: moved, refactor and maybe delete
function useCyberlinks(
  { address }: { address?: string },
  {
    limit = 1024,
    skip,
  }: {
    limit?: number;
    skip?: boolean;
  }
) {
  let where;
  if (address) {
    where = `{neuron: {_eq: "${address}"}}`;
  } else {
    where = '{}';
  }

  const query = useQuery(
    gql`
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
  `,
    {
      skip,
    }
  );

  const cyberlinks = query.data?.cyberlinks;

  const data = useMemo(() => {
    if (!cyberlinks) {
      return {
        nodes: [],
        links: [],
      };
    }

    // TODO: a lot of loops, try to refactor
    const from = cyberlinks.map((a) => a.particle_from);
    const to = cyberlinks.map((a) => a.particle_to);

    const set = new Set(from.concat(to));
    const object = [];
    set.forEach((value) => {
      object.push({ id: value });
    });

    const links = [];

    for (let i = 0; i < cyberlinks.length; i++) {
      links[i] = {
        source: cyberlinks[i].particle_from,
        target: cyberlinks[i].particle_to,
        name: cyberlinks[i].transaction_hash,
        subject: cyberlinks[i].subject,
        // curvative: getRandomInt(20, 500) / 1000,
      };
    }

    return {
      nodes: object,
      links: links,
    };
  }, [cyberlinks]);

  return {
    data,
    loading: query.loading,
  };
}

export default useCyberlinks;
