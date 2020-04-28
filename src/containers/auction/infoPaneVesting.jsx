import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Text } from '@cybercongress/gravity';
import { LinkWindow } from '../../components';

const InfoPaneVesting = ({ endTime }) => {
  return (
    <Pane
      boxShadow="0px 0px 5px #36d6ae"
      paddingX={20}
      paddingY={20}
      marginY={20}
    >
      {endTime === null ? (
        <Text fontSize="16px" color="#fff">
          Vesting allows you to get 1 EUL token for each vested GOL token. GOL
          tokens also allow you to participate in the decisions of{' '}
          <LinkWindow to="https://mainnet.aragon.org/#/eulerfoundation/home/">
            Euler Foundation
          </LinkWindow>
        </Text>
      ) : (
        <Text fontSize="16px" color="#fff">
          Vecting end {endTime}
        </Text>
      )}
    </Pane>
  );
};

export default InfoPaneVesting;
