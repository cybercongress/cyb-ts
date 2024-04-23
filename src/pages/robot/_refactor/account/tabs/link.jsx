import { useQuery, gql } from '@apollo/client';

import TableLink from '../component/tableLink';
import Table from 'src/components/Table/Table';

// const GET_CHARACTERS = gql`
//   query MyQuery($agent: String) {
//     link_aggregate(where: { agent: { _eq: $agent } }) {
//       nodes {
//         transaction
//         timestamp
//         height
//         cid_to
//         cid_from
//         agent
//       }
//     }
//   }
// `;

export default function GetLink() {
  const GET_CHARACTERS = gql`
    query MyQuery {
      cyberlinks_aggregate(where: {neuron: {_eq: "${address}"}}, order_by: {height: desc}) {
    nodes {
      height
      particle_from
      particle_to
      timestamp
      transaction_hash
    }
  }
}
  `;
  const { loading, error, data: dataLink } = useQuery(GET_CHARACTERS);
  if (loading) {
    return 'loading...';
  }
  if (error) {
    return `error! ${error.message}`;
  }

  return <TableLink data={dataLink.cyberlinks_aggregate.nodes} />;
}
