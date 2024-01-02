import gql from 'graphql-tag';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-apollo';
import { useBackend } from 'src/contexts/backend';
import { useEffect, useState } from 'react';
import { useBackend } from 'src/contexts/backend';

const valueByKeyOrSelf = (key: string, obj: Record<string, any>) =>
  obj[key] || key;

function useParticlesPreview() {
  const { senseApi, isDbInitialized } = useBackend();
  const [particlesPreview, setParticlesPreview] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (senseApi && isDbInitialized) {
      (async () => {
        setIsLoading(true);
        const { rows } = await senseApi.getAllParticles([
          'cid',
          'text',
          'mime',
        ]);
        const particles = Object.fromEntries(
          rows.map((row) => {
            return [row[0], row[1] || row[2]];
          })
        );

        setParticlesPreview(particles);
        setIsLoading(false);
      })();
    }
  }, [isDbInitialized, senseApi]);

  return { particlesPreview, isLoading };
}
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
  const { isLoading, particlesPreview } = useParticlesPreview();

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

    const object = Array.from(new Set(from.concat(to))).map((value) => ({
      id: valueByKeyOrSelf(value, particlesPreview),
    }));

    // console.log(
    //   '---obj',
    //   object.filter((o) => o.id.indexOf('Qm') === 0).map((o) => o.id)
    // );

    const links = [];

    for (let i = 0; i < cyberlinks.length; i++) {
      links[i] = {
        source: valueByKeyOrSelf(cyberlinks[i].particle_from, particlesPreview),
        target: valueByKeyOrSelf(cyberlinks[i].particle_to, particlesPreview),
        name: cyberlinks[i].transaction_hash,
        subject: cyberlinks[i].subject,
        // curvative: getRandomInt(20, 500) / 1000,
      };
    }

    return {
      nodes: object,
      links,
    };
  }, [cyberlinks, isLoading, particlesPreview]);

  return {
    data,
    loading: query.loading,
  };
}

export default useCyberlinks;
