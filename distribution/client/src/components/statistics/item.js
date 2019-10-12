import React, { Component } from 'react';
import { Tooltip } from '../index';

export const ContainerCard = ({ children, col, styles }) => (
  <div
    style={{ gridTemplateColumns: `repeat(${col}, 1fr)`, ...styles }}
    className="container-statistics"
  >
    {children}
  </div>
);

export const Indicators = ({ title, value, tooltipValue, positionTooltip }) => (
  <div className="contaiter-indicator">
    <span className="indicator-title">{value}</span>
    <span className="indicator-value">
      {title}{' '}
      <Tooltip placement={positionTooltip} tooltip={tooltipValue}>
        <span>(?)</span>
      </Tooltip>
    </span>
    {/* <div className='dots' /> */}
  </div>
);

export const Card = ({ title, value, tooltipValue, positionTooltip }) => (
  <div className="container-card">
    <span className="card-title">{value}</span>
    <span className="card-value">
      {title}{' '}
      <Tooltip placement={positionTooltip} tooltip={tooltipValue}>
        <span>(?)</span>
      </Tooltip>
    </span>
  </div>
);

export const CardArrow = ({ title, value, win }) => (
  <div className="container-card-arrow">
    <div className={`card-title ${win === 'eth' ? 'eth' : 'atom'}`}>
      {value}
      <div
        className={`card-arrow ${
          win === 'eth'
            ? 'card-arrow-transfonm-eth'
            : 'card-arrow-transfonm-atom'
        }`}
      />
    </div>
    <div className="card-value">{title}</div>
  </div>
);
