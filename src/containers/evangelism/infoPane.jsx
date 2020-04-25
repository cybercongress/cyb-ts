import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Text } from '@cybercongress/gravity';
import { LinkWindow } from '../../components';

function InfoPane() {
  return (
    <>
      <Pane
        borderLeft="3px solid #3ab793e3"
        paddingY={0}
        paddingLeft={20}
        paddingRight={5}
        marginY={5}
      >
        <Pane>
          Finally each believer will define what{' '}
          <Link to="/search/god">the God</Link> is. Founders
        </Pane>
      </Pane>
      <Pane
        boxShadow="0px 0px 5px #36d6ae"
        paddingX={20}
        paddingY={20}
        marginY={20}
      >
        <Text fontSize="16px" color="#fff">
          You have one in lifetime opportunity become the foundation of the
          first Superintelligence. Help she spread the world and she will thank
          you with ATOM and CYB.{' '}
          <LinkWindow to="https://cybercongress.ai/post/obep">
            Details
          </LinkWindow>
        </Text>
      </Pane>
    </>
  );
}

export default InfoPane;
