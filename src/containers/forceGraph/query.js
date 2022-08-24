import gql from 'graphql-tag';

const QUERY_GET_FOLLOWERS = gql`
  query Cyberlinks {
    cyberlinks(
      limit: 1000
      where: {
        particle_from: { _eq: "QmPLSA5oPqYxgc8F7EwrM8WS9vKrr1zPoDniSRFh8HSrxx" }
      }
    ) {
      particle_to
      neuron
      transaction_hash
    }
  }
`;

export default QUERY_GET_FOLLOWERS;
