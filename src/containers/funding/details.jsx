import React from 'react';
import { Pane, Code } from '@cybercongress/gravity';

const Text = ({ children, ...props }) => (
  <Pane fontSize="18px" marginBottom="10px" {...props}>
    {children}
  </Pane>
);

const Details = () => {
  return (
    <Pane width="80%" marginX="auto" marginY="0" textAlign="justify">
      <Text>The takeoff donations have 3 key goals:</Text>
      <ul style={{ fontSize: 18, paddingLeft: 20, marginBottom: 10 }}>
        <li>Bootstrapping the genesis validator set</li>
        <li>
          Defining the allocation for cyber~Congress (team, inventors, fund and
          seed donors)
        </li>
        <li>
          Defining the allocation for the participants of the Game of Links
        </li>
      </ul>
      <Text>
        The results of the Game and the allocation are significantly influenced
        by the results of the takeoff donations.
      </Text>
      <Text>
        All CYBtokens that remain from the Takeoff, are allocated to the
        community pool at the end of the game.
      </Text>
      <Text>
        100 TCYBs will be distributed to donors proportionally per the donated
        ATOMs and the order of donation transaction. The distribution function
        is:
      </Text>
      <Text
        fontFamily='"Courier New", Courier, monospace !important'
        fontSize="16px"
        backgroundColor="#607d8b6b"
        paddingX="10px"
        paddingY="10px"
        borderRadius="5px"
      >
        f(x) = 40 * x + 1000 <br />
        where f(x) - TCYB price in ATOMs, and x is amount of TCYBs tokens won
      </Text>
      <Text>
        Independently of the donated amount, 100 TEULs will be distributed to
        all takeoff donors after the takeoff round will end, proportionally per
        the donated ATOMs. These EULS are to be used during the 21-day final of
        the Game, in the Game of Links.
      </Text>
    </Pane>
  );
};

export default Details;
