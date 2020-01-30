import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';

const CardTemplate = ({
  title,
  paddingBottom,
  children,
  marginBottom,
  borderBottom,
}) => (
  <Pane
    paddingTop={20}
    paddingBottom={paddingBottom || 0}
    paddingX={20}
    borderRadius={5}
    display="flex"
    flexDirection="column"
    boxShadow="0 0 5px #3ab793"
    marginBottom={marginBottom || 0}
  >
    <Pane
      paddingX={0}
      paddingTop={5}
      paddingBottom={10}
      borderBottom={borderBottom || 'none'}
    >
      <Text color="#fff" fontSize="20px" fontWeight="500" lineHeight="1.5">
        {title}
      </Text>
    </Pane>
    <Pane display="flex" width="100%" flexDirection="column">
      {children}
    </Pane>
  </Pane>
);

export default CardTemplate;
