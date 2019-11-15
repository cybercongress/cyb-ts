import React from 'react';

const Gift = ({ text }) => (
  <div className="container-notFound">
    <div className="clontainer-vitalik">
      <div className="vitalik-oval-1" />
      <div className="vitalik-oval-2" />
    </div>
    {text && <span className="text-notFound">{text}</span>}
    {!text && <span className="text-notFound">Page Gift In Progress </span>}
  </div>
);
export default Gift;
