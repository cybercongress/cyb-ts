import React from 'react';
import { Link } from 'react-router-dom';
import ContentItem from '../contentItem';
import Noitem from '../../account/noItem';

function AnswersTab({ data, nodeIpfs }) {
  if (data.length > 0) {
    return (
      <div className="container-contentItem">
        {data.map(item => (
          <Link key={item.cid} to={`/ipfs/${item.cid}`}>
            <ContentItem nodeIpfs={nodeIpfs} cid={item.cid} item={item} />
          </Link>
        ))}
      </div>
    );
  }
  return <Noitem text="No cyberLinks" />;
}

export default AnswersTab;
