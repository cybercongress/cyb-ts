import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function DocsTab() {
  return (
    <Pane
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
      gridGap="20px"
    >
      <LinkWindow to="https://github.com/cybercongress/congress/blob/master/ecosystem/ELI-5%20FAQ.md">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="ELI-5"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://github.com/cybercongress/congress/blob/master/ecosystem/Cyber%20Homestead%20doc.md">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="Homestead"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://cybercongress.ai/docs/cyberd/run_validator/">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="Validator doc"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://ipfs.io/ipfs/QmPjbx76LycfzSSWMcnni6YVvV3UNhTrYzyPMuiA9UQM3x">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="Whitepaper"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://github.com/cybercongress/go-cyber">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
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
          }}
          styleTitle={{ fontSize: '26px' }}
          title="dot-cyber"
          link
        />
      </LinkWindow>
    </Pane>
  );
}

export default DocsTab;
