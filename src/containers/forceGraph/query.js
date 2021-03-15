import gql from 'graphql-tag';

const QUERY_GET_FOLLOWERS = gql`
  query Cyberlinks {
    cyberlink(
      limit: 1000
      where: {
        object_from: { _eq: "QmPLSA5oPqYxgc8F7EwrM8WS9vKrr1zPoDniSRFh8HSrxx" }
      }
    ) {
      object_to
      subject
      txhash
    }
  }
`;

export default QUERY_GET_FOLLOWERS;
