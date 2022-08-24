import React from 'react';
import { Pane, Icon } from '@cybercongress/gravity';
import { useHistory } from 'react-router-dom';
import Card from '../ui/card';
import { formatNumber } from '../../../utils/utils';

const PREFIXES = [
  {
    prefix: 't',
    power: 10 ** 12,
  },
  {
    prefix: 'g',
    power: 10 ** 9,
  },
  {
    prefix: 'm',
    power: 10 ** 6,
  },
  {
    prefix: 'k',
    power: 10 ** 3,
  },
];

function Statistics({ myEnegy = 0, income = 0, outcome = 0, active }) {
  const history = useHistory();

  const freeEnergy = myEnegy + income - outcome;

  return (
    <Pane
      marginTop={10}
      marginBottom={10}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex-irection="row"
    >
      <Card
        active={active === 'myEnegy'}
        title="My Enegy"
        value={`${formatNumber(myEnegy)} W`}
        onClick={() => history.push('/grid')}
      />
      <Pane marginX={5} fontSize="20px">
        +
      </Pane>
      <Card
        active={active === 'income'}
        title="Income"
        value={`${formatNumber(income)} W`}
        onClick={() => history.push('/grid/income')}
      />
      <Pane marginX={5} fontSize="20px">
        -
      </Pane>
      <Card
        active={active === 'outcome'}
        title="Outcome"
        value={`${formatNumber(outcome)} W`}
        onClick={() => history.push('/grid/outcome')}
      />
      <Pane marginX={5} fontSize="20px">
        =
      </Pane>
      <Card
        title="Free Energy"
        value={`${formatNumber(freeEnergy > 0 ? freeEnergy : 0)} W`}

        // tooltipValue="Your rating in relation to the rating of the network is less than 1000%"
        // positionTooltip="bottom"
      />
    </Pane>
  );
}

export default Statistics;
