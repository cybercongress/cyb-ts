import React from 'react';
import { Button, Input, Pane } from '@cybercongress/ui';
import { Electricity } from './electricity';

const Home = () => (
  <main className="block-body-home">
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="auto"
      d
    >
      <Input width="60%" placeholder="joint for validators" />
    </Pane>
    <Pane width="60%" marginY={0} marginX="auto">
      <Electricity />
    </Pane>
  </main>
);

export default Home;
