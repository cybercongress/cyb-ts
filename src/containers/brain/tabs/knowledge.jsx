import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function KnowledgeTab({ linksCount, cidsCount, accountsCount }) {
  try {
    return (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics title="cyberlinks" value={formatNumber(linksCount)} />
        <CardStatisics title="objects" value={formatNumber(cidsCount)} />

        <CardStatisics title="subjects" value={formatNumber(accountsCount)} />
      </Pane>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default KnowledgeTab;
