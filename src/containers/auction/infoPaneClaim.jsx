import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Text } from '@cybercongress/gravity';

const InfoPaneClaim = ({ openTime, startTimeTot }) => {
  let content;

  const textStart = `start ${startTimeTot}`;

  switch (openTime) {
    case 'intro':
      content = textStart;
      break;
    case 'end':
      content = 'end';
      break;
    default:
      content = <Pane>claim GOL after the end of each round</Pane>;
      break;
  }

  return (
    <Pane
      boxShadow="0px 0px 5px #36d6ae"
      paddingX={20}
      paddingY={20}
      marginY={20}
    >
      <Text fontSize="16px" color="#fff">
        {content}
      </Text>
    </Pane>
  );
};

export default InfoPaneClaim;
