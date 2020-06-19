import React from 'react';
import { Link } from 'react-router-dom';
import Noitem from '../../account/noItem';
import ContentItem from '../contentItem';

const OptimisationTab = ({ data, nodeIpfs }) => {
  if (data && data.cyberlink.length > 0) {
    return (
      <div className="container-contentItem">
        {data.cyberlink.map((item, i) => (
          <Link
            key={`${item.object_from}_${i}`}
            to={`/ipfs/${item.object_from}`}
          >
            <ContentItem
              nodeIpfs={nodeIpfs}
              cid={item.object_from}
              item={item}
            />
          </Link>
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
