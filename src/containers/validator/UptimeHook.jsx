import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
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

    if (data !== undefined) {
      if (
        Object.keys(data.pre_commit).length !== 0 &&
        Object.keys(data.pre_commit_aggregate).length !== 0 &&
        Object.keys(data.block_aggregate).length !== 0
      ) {
        const thisBlock = data.block_aggregate.nodes[0].height;
        const firstPreCommit = data.pre_commit[0].validator.blocks[0].height;
        const countPreCommit = data.pre_commit_aggregate.aggregate.count;
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
