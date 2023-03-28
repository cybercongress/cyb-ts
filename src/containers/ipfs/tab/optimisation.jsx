import React from 'react';
import { Pane } from '@cybercongress/gravity';
import ContentItem from '../contentItem';
import { Rank, NoItems } from '../../../components';

function OptimisationTab({ data, mobile, nodeIpfs }) {
  if (data && Object.keys(data).length > 0) {
    return (
      <div style={{ width: '100%' }}>
        {Object.keys(data).map((key, i) => {
          return (
            <Pane
              position="relative"
              className="hover-rank"
              display="flex"
              alignItems="center"
              marginBottom="10px"
              key={`${key}_${i}`}
            >
              {!mobile && (
                <Pane
                  className="time-discussion rank-contentItem"
                  position="absolute"
                >
                  <Rank hash={key} rank="n/a" grade={data[key].grade} />
                </Pane>
              )}
              <ContentItem
                nodeIpfs={nodeIpfs}
                cid={key}
                item={data[key]}
                className="contentItem"
              />
            </Pane>
          );
        })}
      </div>
    );
  }
  return (
    <div className="container-contentItem">
      <NoItems text="No cyberLinks" />
    </div>
  );
}

export default OptimisationTab;
