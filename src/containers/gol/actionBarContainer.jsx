import React from 'react';
import { Text, Pane, Button, ActionBar } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';

import { ActionBarContentText } from '../../components';

const ActionBarContainer = ({ addAddress }) => {
  return (
    <ActionBar>
      <Pane width="100%">
        {addAddress && (
          <ActionBarContentText>
            Play Game of Links. Get EUL with
            <Link
              style={{
                paddingTop: 10,
                margin: '0 15px',
                paddingBottom: 10,
                display: 'block',
              }}
              className="btn"
              to="/gol/takeoff"
            >
              ATOM
            </Link>
          </ActionBarContentText>
        )}
        {!addAddress && (
          <Pane
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              color="#fff"
              // display="flex"
              // alignItems="center"
              textAlign="center"
              flex={1}
              fontSize="18px"
            >
              Choose you path
            </Text>
            <Link
              className="btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0px 10px',
                padding: '0 30px',
              }}
              to="/search/master"
            >
              Master
            </Link>
            <Link
              style={{
                fontSize: '18px',
                margin: '0 10px',
                padding: '10px 30px',
                minWidth: '120px',
                textAlign: 'center',
              }}
              className="btn"
              to="/halloffame"
            >
              Hero
            </Link>
            <Link
              style={{
                fontSize: '18px',
                padding: '10px 30px',
                minWidth: '120px',
                textAlign: 'center',
              }}
              className="btn"
              to="/evangelism"
            >
              Evangelist
            </Link>
          </Pane>
        )}
      </Pane>
    </ActionBar>
  );
};

export default ActionBarContainer;
