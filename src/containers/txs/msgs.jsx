import React from 'react';
import { Text, Pane } from '@cybercongress/gravity';
import Activites from './Activites';

const Msgs = ({ data }) => {
  console.log('data', data);

  return (
    <Pane
      paddingTop={20}
      paddingBottom={0}
      paddingX={20}
      borderRadius={5}
      display="flex"
      flexDirection="column"
      boxShadow="0 0 5px #3ab793"
    >
      <Pane
        paddingX={0}
        paddingTop={5}
        paddingBottom={10}
        borderBottom="1px solid #3ab7938f"
      >
        <Text color="#fff" fontSize="20px" fontWeight="500" lineHeight="1.5">
          Msgs
        </Text>
      </Pane>
      <Pane display="flex" paddingTop={20} width="100%" flexDirection="column">
        {data.map(msg => (
          <Activites msg={msg} />
        ))}
      </Pane>
    </Pane>
  );
};

export default Msgs;
