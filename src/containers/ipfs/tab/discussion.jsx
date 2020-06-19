import React from 'react';
import { Pane } from '@cybercongress/gravity';
import Noitem from '../../account/noItem';
import ContentItem from '../contentItem';

const dateFormat = require('dateformat');

function DiscussionTab({ data, nodeIpfs }) {
  if (data && data.cyberlink.length > 0) {
    return (
      <div className="container-contentItem">
        {data.cyberlink.map((item, i) => {
          return (
            <Pane position="relative" display="flex" alignItems="center">
              <ContentItem
                key={`${item.object_to}_${i}`}
                nodeIpfs={nodeIpfs}
                cid={item.object_to}
                item={item}
              />
              <Pane
                className="time-discussion"
                position="absolute"
                left="100%"
                fontSize={12}
                top="5px"
              >
                {dateFormat(item.timestamp, 'dd/mm/yyyy, HH:MM')}
              </Pane>
            </Pane>
          );
        })}
      </div>
    );
  }
  return (
    <div className="container-contentItem">
      <Noitem text="No cyberLinks" />
    </div>
  );
}

export default DiscussionTab;
