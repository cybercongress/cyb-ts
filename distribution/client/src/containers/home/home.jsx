import React from 'react';
import { Button, Input, Pane } from '@cybercongress/gravity';
import { Electricity } from './electricity';

const tilde = require('../../image/tilde.svg');

const Home = () => (
  <main className="block-body-home">
    <Pane display="flex" alignItems="center" justifyContent="center" flex={0.7}>
      <Input width="60%" placeholder="joint for validators" />
    </Pane>
    <Pane
      flex={0.3}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-around"
    >
      <Pane width="60%" marginY={0} marginX="auto">
        <Electricity />
      </Pane>
      <img style={{ width: 20, height: 20 }} src={tilde} alt="tilde" />
    </Pane>
  </main>
);

export default Home;
