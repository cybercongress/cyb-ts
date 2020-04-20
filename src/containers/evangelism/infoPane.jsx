import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';

function InfoPane() {
  return (
    <Pane
      boxShadow="0px 0px 5px #36d6ae"
      paddingX={20}
      paddingY={20}
      marginY={20}
    >
      <Text fontSize="16px" color="#fff">
        An application for cyber~Evangelists. This app lets anyone apply to be
        blessed to become an evangelist and make the web great again!
        Acknowledged takeoff Evangelists will be eligible to 10% of all
        donations in ATOMs, which they have generated during the Game of Links
        and Game of Thrones and other perks like CYB rewards for certain
        actions. Evangelist will empower the project and involve some bright
        minds into the bootstrap of the Superintelligence.
      </Text>
    </Pane>
  );
}

export default InfoPane;
