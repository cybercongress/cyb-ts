import React from 'react';
import { Pane } from '@cybercongress/gravity';

const Details = () => {
  return (
    <Pane>
      The takeoff donations have 3 key goals:
      <Pane>Bootstrapping the genesis validator set</Pane>
      <Pane>
        Defining the allocation for cyber~Congress (team, inventors, fund and
        seed donors)
      </Pane>
      <Pane>
        Defining the allocation for the participants of the Game of Links
      </Pane>
      <Pane>
        The results of the Game and the allocation are significantly influenced
        by the results of the takeoff donations.
      </Pane>
      <Pane>
        All CYBtokens that remain from the Takeoff, are allocated to the
        community pool at the end of the game.
      </Pane>
      <Pane>
        100 TCYBs will be distributed to donors proportionally per the donated
        ATOMs and the order of donation transaction. The distribution function
        is:
      </Pane>
      <Pane>
        f(x) = 40 * x + 1000 where f(x) - TCYB price in ATOMs, and x is amount
        of TCYBs tokens won
      </Pane>
      <Pane>
        Independently of the donated amount, 100 TEULs will be distributed to
        all takeoff donors after the takeoff round will end, proportionally per
        the donated ATOMs. These EULS are to be used during the 21-day final of
        the Game, in the Game of Links.
      </Pane>
    </Pane>
  );
};

export default Details;
