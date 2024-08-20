import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import {
  ParticlesQuery,
  useParticlesAggregateQuery,
  useParticlesQuery,
} from 'src/generated/graphql';
import { useRobotContext } from 'src/pages/robot/robot.context';

import { createColumnHelper } from '@tanstack/react-table';
import Table from 'src/components/Table/Table';
import ContentItem from 'src/components/ContentItem/contentItem';
import { Display, DisplayTitle } from 'src/components';
import { useState } from 'react';

const columnHelper = createColumnHelper<ParticlesQuery['particles'][0]>();

const LIMIT = 200;

function Particles() {
  const { address } = useRobotContext();
  const [offset, setOffset] = useState(0);

  const { data, loading, error } = useParticlesQuery({
    variables: {
      neuron: address,
      limit: offset + LIMIT,
    },
  });

  const particleAggregateQuery = useParticlesAggregateQuery({
    variables: {
      neuron: address,
    },
  });

  useAdviserTexts({
    defaultText: 'Particles',
    isLoading: loading,
    error,
  });

  console.log(data);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
      }}
    >
      <Display
        title={
          <DisplayTitle title="Particles">
            <p>
              {
                particleAggregateQuery.data?.particles_aggregate.aggregate
                  ?.count
              }{' '}
              particles
            </p>
          </DisplayTitle>
        }
      >
        {/* <InfiniteScroll
          dataLength={data?.cyberlinks.length || 0}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Loader2 />}
        > */}
        <Table
          columns={[
            columnHelper.accessor('particle', {
              header: 'CID',
              cell: (info) => {
                return <ContentItem cid={info.getValue()} />;
              },
            }),
            columnHelper.accessor('timestamp', {
              header: 'timestamp',
              cell: (info) => info.getValue(),
            }),
          ]}
          data={data?.particles || []}
        />
        {/* </InfiniteScroll> */}
      </Display>
    </div>
  );
}

export default Particles;
