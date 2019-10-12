import React from 'react';

export const Ticket = ({ capacity, tickets, dots }) => (
  <div>
    <p className="title-code padding-left-45" style={{ marginTop: '30px' }}>
      capacity =<span className="string">&nbsp;{capacity}</span>
    </p>
    <p className="title-code padding-left-45">
      available tickets =
      <span className="string">
        &nbsp;{tickets.amount ? tickets.amount : dots}
      </span>
    </p>
    <p className="title-code padding-left-45">
      current price =
      <span className="string">
        &nbsp;
        {tickets.price ? Number.parseFloat(tickets.price).toFixed(2) : dots}
        &nbsp;ETH
      </span>
    </p>
  </div>
);
