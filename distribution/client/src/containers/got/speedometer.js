import React from 'react';

export const Speedometer = ({ arow }) => (
  <div className="wrapper-speedometer">
    <div className="speedometer">
      <div className="pointer">
        <div
          className="arow"
          style={{
            transform: ` rotate(${arow}deg)`
          }}
        />
      </div>
    </div>
  </div>
);
