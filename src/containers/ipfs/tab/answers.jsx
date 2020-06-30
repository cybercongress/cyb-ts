import React from 'react';
import { Pane, Rank } from '@cybercongress/gravity';
import ContentItem from '../contentItem';
import Noitem from '../../account/noItem';
import { getRankGrade } from '../../../utils/search/utils';

function AnswersTab({ data, mobile, nodeIpfs }) {
  if (data.length > 0) {
    return (
      <div className="container-contentItem" style={{ width: '100%' }}>
        {data.map((item, i) => {
          const grade = getRankGrade(item.rank);
          return (
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
                  <Rank hash={item.cid} rank={item.rank} grade={grade} />
                </Pane>
              )}
              <ContentItem
                key={`${item.cid}_${i}`}
                nodeIpfs={nodeIpfs}
                cid={item.cid}
                item={item}
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
      <Noitem text="No cyberLinks" />
    </div>
  );
}

export default AnswersTab;
