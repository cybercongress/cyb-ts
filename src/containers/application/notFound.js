import React from 'react';

const NotFound = ({ text }) => (
  <div className="container-notFound">
    <div className="clontainer-vitalik">
      <div className="vitalik-oval-1" />
      <div className="vitalik-oval-2" />
    </div>
    {text && (
      <span className="text-notFound">{text}</span>
    )}
    {!text && (
      <span className="text-notFound">Page In Progress </span>
    )}
  </div>
);
export default NotFound;
