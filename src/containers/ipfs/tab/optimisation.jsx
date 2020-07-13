import React from 'react';
import { Pane, Rank } from '@cybercongress/gravity';
import Noitem from '../../account/noItem';
import ContentItem from '../contentItem';

const OptimisationTab = ({ data, mobile, nodeIpfs }) => {
  if (data && data.cyberlink.length > 0) {
    return (
      <div className="container-contentItem" style={{ width: '100%' }}>
        {data.cyberlink.map((item, i) => (
          <Pane
            position="relative"
            className="hover-rank"
            display="flex"
            alignItems="center"
            marginBottom="10px"
          >
            {!mobile && (
              <Pane
                className="time-discussion rank-contentItem"
                position="absolute"
              >
                <Rank
                  hash={item.object_from}
                  rank="n/a"
                  grade={{ from: 'n/a', to: 'n/a', value: 'n/a' }}
                />
              </Pane>
            )}
            <ContentItem
              key={`${item.object_from}_${i}`}
              nodeIpfs={nodeIpfs}
              cid={item.object_from}
              item={item}
              className="contentItem"
            />
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
};

export default OptimisationTab;
