import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import TableLink from '../component/tableLink';
import useGetAddressTemp from '../hooks/useGetAddressTemp';
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
  const address = useGetAddressTemp();
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
    return 'Loading...';
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  return (
    <TableLink data={dataLink.cyberlinks_aggregate.nodes} />

    // {/* <Table
    // columns={["Tx", "Timestamp, UTC", "From", "To"]}
    // data={dataLink.cyberlinks_aggregate.nodes.map((item, i) => {
    //   return {

    //     })}

    // /> */}
  );
}
