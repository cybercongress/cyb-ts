import React from 'react';
import Noitem from '../../account/noItem';
import ContentItem from '../contentItem';

const OptimisationTab = ({ data, nodeIpfs }) => {
  if (data && data.cyberlink.length > 0) {
    return (
      <div className="container-contentItem">
        {data.cyberlink.map((item, i) => (
          <ContentItem
            key={`${item.object_from}_${i}`}
            nodeIpfs={nodeIpfs}
            cid={item.object_from}
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
};

export default OptimisationTab;
