import React from 'react';

export const WhatWhereWhen = ({ what, data, dots }) => (
  <div>
    <p className="title-code padding-left-45">
      topic =<span className="string">&nbsp;“{what}”</span>
    </p>
    <p className="title-code padding-left-45">
      location =
      <span className="string">
        &nbsp;{data.place ? `“${data.place}”` : dots}
      </span>
    </p>
    <p className="title-code padding-left-45">
      date =
      <span className="string">
        &nbsp;{data.startTime ? `“${data.startTime}”` : dots}
      </span>
    </p>
  </div>
);
