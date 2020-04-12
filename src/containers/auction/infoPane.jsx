import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';

const InfoPane = ({ openTime, startTimeTot }) => {
  let content;

  const textStart = `start ${startTimeTot}`;

  const text = ` Here you can get GOLs tokens and then participate in the governance of
  cyber~Foundation DAO. After round's end, you may claim GOLs and then get
  1-to-1 your EULs in Cyber with vesting your GOLs till the end of the
  auction.`;

  switch (openTime) {
    case 'intro':
      content = textStart;
      break;
    case 'end':
      content = 'end';
      break;
    default:
      content = text;
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

export default InfoPane;