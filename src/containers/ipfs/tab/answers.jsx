import React from 'react';
import ContentItem from '../contentItem';
import Noitem from '../../account/noItem';

function AnswersTab({ data, nodeIpfs }) {
  if (data.length > 0) {
    return (
      <div className="container-contentItem">
        {data.map((item, i) => (
          <ContentItem
            key={`${item.cid}_${i}`}
            nodeIpfs={nodeIpfs}
            cid={item.cid}
            item={item}
          />
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

export default AnswersTab;
