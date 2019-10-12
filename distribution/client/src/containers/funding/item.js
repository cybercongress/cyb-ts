import React, { Component } from 'react';
import { Tooltip } from '../../components/index';

export const Container = ({ children }) => (
  <div className="container-statistics">{children}</div>
);

export const Indicators = ({ title, value, tooltipValue, positionTooltip }) => (
  <Tooltip placement={positionTooltip} tooltip={tooltipValue}>
    <div className="contaiter-indicator">
      <span className="indicator-title">{title}</span>
      <span className="indicator-value">{value}</span>
      {/* <div className='dots' /> */}
    </div>
  </Tooltip>
);

export const Card = ({ title, value }) => (
  <div className="container-card">
    <span className="card-title">{title}</span>
    <span className="card-value">{value}</span>
  </div>
);
