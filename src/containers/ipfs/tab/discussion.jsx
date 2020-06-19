import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import Noitem from '../../account/noItem';
import ContentItem from '../contentItem';

const dateFormat = require('dateformat');

function DiscussionTab({ data, nodeIpfs }) {
  if (data && data.cyberlink.length > 0) {
    return (
      <div className="container-contentItem">
        {data.cyberlink.map((item, i) => (
          <Pane position="relative" display="flex" alignItems="center">
            <Link
              style={{ width: '100%' }}
              key={`${item.object_to}_${i}`}
              to={`/ipfs/${item.object_to}`}
            >
              <ContentItem
                nodeIpfs={nodeIpfs}
                cid={item.object_to}
                item={item}
              />
            </Link>
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
        ))}
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
