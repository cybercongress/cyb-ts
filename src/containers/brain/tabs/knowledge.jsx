import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function KnowledgeTab({ linksCount, cidsCount, accountsCount }) {
  try {
    return (
      <>
        <Link to="/graph">
          <CardStatisics
            title="Cyberlinks"
            link
            value={formatNumber(linksCount)}
          />
        </Link>
        <Link
          to="/gol/relevance"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics title="Objects" value={formatNumber(cidsCount)} link />
        </Link>

        <CardStatisics title="Subjects" value={formatNumber(accountsCount)} />
      </>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default KnowledgeTab;
