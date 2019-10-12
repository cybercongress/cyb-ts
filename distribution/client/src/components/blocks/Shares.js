import React from 'react';

export const Shares = ({ shares, dots }) => (
  <div>
    <p className="title-func" style={{ marginTop: '33px' }}>
      <span className="italic">current shares</span> ():
    </p>
    <p className="title-code padding-left-45" style={{ marginTop: '28px' }}>
      speaker’s share =&nbsp;
      {shares.speakers ? (
        <span className="string">{shares.speakers}%</span>
      ) : (
        dots
      )}
    </p>
    <p className="title-code padding-left-45">
      organiser’s share =&nbsp;
      {shares.organizers ? (
        <span className="string">
          {shares.organizers ? shares.organizers : dots}%
        </span>
      ) : (
        dots
      )}
    </p>
    <p className="title-code padding-left-45" style={{ marginTop: '30px' }}>
      CURRENT TICKETS FUND
    </p>
    <div className="block-button-white" style={{ margin: '37px 0 0 45px' }}>
      {shares.funds ? (
        <p style={{ color: '#ff0000' }}>
          {Number.parseFloat(shares.funds).toFixed(2)} ETH
        </p>
      ) : (
        dots
      )}
    </div>
  </div>
);
