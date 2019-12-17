import React, { Component } from 'react';
import { Tooltip, Icon } from '../index';
import { Pane } from '@cybercongress/gravity';

const iconHelp = require('../../image/_ionicons_svg_ios-help-circle-outline.svg');

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
    <div className="indicator-value">
      {/* <span> */}
      {title}
      {/* </span> */}
      <Tooltip placement={positionTooltip} tooltip={tooltipValue}>
        <Icon icon={iconHelp} />
      </Tooltip>
    </div>
    {/* <div className='dots' /> */}
  </div>
);

export const Card = ({ title, value, tooltipValue, positionTooltip }) => (
  <div className="container-card">
    <span className="card-title">{value}</span>
    <span className="card-value">
      {title}{' '}
      {tooltipValue && (
        <Tooltip placement={positionTooltip} tooltip={tooltipValue}>
          <Icon icon={iconHelp} />
        </Tooltip>
      )}
    </span>
  </div>
);

export const CardStatisics = ({ title, value, icon }) => (
  <div className="container-statistics-card">
    <span className="card-statistics-value">{value}</span>
    <Pane display="flex" alignItems="center">
      <span className="card-statistics-title">{title}</span>
      {icon}
    </Pane>
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
