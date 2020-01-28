import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

const GET_CHARACTERS = gql`
query MyQuery {
  link_aggregate(where: {agent: {_eq: "cyber177gvvqtn7xl8qvl6yw4vax9raz80fx66aukc94"}}) {
    nodes {
      transaction
      timestamp
      height
      cid_to
      cid_from
      agent
    }
  }
}
`;

export function CharacterWithRender() {
  return (
    <Query query={GET_CHARACTERS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        console.log(data);
        return (
          <div className="characters">
            ok
            {/* {data.characters.results.map(character => (
              <div key={character.name} className="character">
                <img src={character.image} alt={character.name} />
                <p>{character.name}</p>
              </div>
            ))} */}
          </div>
        );
      }}
    </Query>
  );
}

class AccountDetails extends React.Component {
  render() {
    return <CharacterWithRender />;
  }
}

export default AccountDetails;
