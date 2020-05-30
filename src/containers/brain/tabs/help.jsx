import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import { WP } from '../../../utils/config';

function HelpTab() {
  return (
    <>
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
      <LinkWindow to={WP}>
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
      <LinkWindow to="https://cybercongress.ai/post/">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="Blog"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://t.me/fuckgoogle">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="Telegram"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://ai.cybercongress.ai/">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="Forum"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://www.reddit.com/r/cybercongress/">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="Reddit"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://twitter.com/cyber_devs">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="Twitter"
          link
        />
      </LinkWindow>
      <LinkWindow to="https://www.youtube.com/channel/UCUfxwbONrtEFeCHOA3gHT-g">
        <CardStatisics
          // title="Homestead"
          styleContainer={{
            justifyContent: 'center',
            padding: '65px 0',
            fontSize: '26px',
          }}
          styleTitle={{ fontSize: '26px' }}
          title="Cyberacademy"
          link
        />
      </LinkWindow>
    </>
  );
}

export default HelpTab;
