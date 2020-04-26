import React from 'react';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function CommunityTab() {
  return (
    <Pane
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
      gridGap="20px"
    >
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
    </Pane>
  );
}

export default CommunityTab;
