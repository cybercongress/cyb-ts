import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Text } from '@cybercongress/gravity';

const InfoPane = ({ openTime, startTimeTot }) => {
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
      content = (
        <Pane>
          Here you can get GOL tokens and then participate in the{' '}
          <Link to="/gol">Game of Links</Link>.{' '}
          <Link to="/gol/vesting">Vesting</Link> allows you to get 1 EUL for each
          GOL. Dont forget to vest your GOL as they become useless in 10 days
          after auction end.
        </Pane>
      );
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
