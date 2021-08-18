import React from 'react';
import { Pane, Icon } from '@cybercongress/gravity';
import { useHistory } from 'react-router-dom';
import Card from '../ui/card';
import { formatCurrency } from '../../../utils/utils';

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
        value={formatCurrency(myEnegy, 'W', 2, PREFIXES)}
        onClick={() => history.push('/energy')}
      />
      <Pane marginX={5} fontSize="20px">
        +
      </Pane>
      <Card
        active={active === 'income'}
        title="Income"
        value={formatCurrency(income, 'W', 2, PREFIXES)}
        onClick={() => history.push('/energy/income')}
      />
      <Pane marginX={5} fontSize="20px">
        -
      </Pane>
      <Card
        active={active === 'outcome'}
        title="Outcome"
        value={formatCurrency(outcome, 'W', 2, PREFIXES)}
        onClick={() => history.push('/energy/outcome')}
      />
      <Pane marginX={5} fontSize="20px">
        =
      </Pane>
      <Card
        title="Free Energy"
        value={formatCurrency(
          freeEnergy > 0 ? freeEnergy : 0,
          'W',
          2,
          PREFIXES
        )}

        // tooltipValue="Your rating in relation to the rating of the network is less than 1000%"
        // positionTooltip="bottom"
      />
    </Pane>
  );
}

export default Statistics;
