import React from 'react';
import { Link } from 'react-router-dom';
import Noitem from '../../account/noItem';
import ContentItem from '../contentItem';

function DiscussionTab({ data, nodeIpfs }) {
  if (data && data.cyberlink.length > 0) {
    return (
      <div className="container-contentItem">
        {data.cyberlink.map((item, i) => (
          <Link key={`${item.object_to}_${i}`} to={`/ipfs/${item.object_to}`}>
            <ContentItem nodeIpfs={nodeIpfs} cid={item.object_to} item={item} />
          </Link>
        ))}
      </div>
    );
  }
  return <Noitem text="No cyberLinks" />;
}

export default DiscussionTab;
