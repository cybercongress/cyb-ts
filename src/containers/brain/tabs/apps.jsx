import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function AppsTab() {
  return (
    <>
      <LinkWindow to="https://github.com/cybercongress/go-cyber">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
            maxWidth: '300px',
            margin: '0 auto',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="go-cyber"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://github.com/cybercongress/dot-cyber">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
            maxWidth: '300px',
            margin: '0 auto',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="dot-cyber"
          link
        />
      </LinkWindow>
    </>
  );
}

export default AppsTab;
