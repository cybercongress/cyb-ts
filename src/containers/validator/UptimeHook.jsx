import { useQuery, gql } from '@apollo/client';
import { Dots } from '../../components';
import { formatNumber, fromBech32 } from '../../utils/utils';

function useUptime({ accountUser }) {
  try {
    const GET_CHARACTERS = gql`
    query uptime {
      uptime(where: {consensus_address: {_eq: "${fromBech32(
        accountUser,
        'bostromvalcons'
      )}"}}) {
        uptime
      }

    }
  `;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { loading, data } = useQuery(GET_CHARACTERS);

    if (loading) {
      return <Dots />;
    }

    let uptime = 0;

    if (data) {
      const { pre_commit, pre_commit_aggregate, block_aggregate } = data;

      if (
        pre_commit &&
        pre_commit_aggregate &&
        block_aggregate &&
        Object.keys(pre_commit).length !== 0 &&
        Object.keys(pre_commit_aggregate).length !== 0 &&
        Object.keys(block_aggregate).length !== 0
      ) {
        const thisBlock = block_aggregate.nodes[0].height;
        const firstPreCommit = pre_commit[0].validator.blocks[0].height;
        const countPreCommit = pre_commit_aggregate.aggregate.count;
        uptime = countPreCommit / (thisBlock - firstPreCommit);
      }
    }

    return `${formatNumber(uptime * 100, 2)} %`;
  } catch (error) {
    console.warn(error);
    return '∞';
  }
}

export default useUptime;
