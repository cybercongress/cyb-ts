import React, { Component } from 'react';
import { Pane, Icon, Tooltip } from '@cybercongress/gravity';
// import { Tooltip } from '../index';

// const iconHelp = require('../../image/_ionicons_svg_ios-help-circle-outline.svg');

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

      {tooltipValue && (
        <Tooltip position={positionTooltip} content={tooltipValue}>
          <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
        </Tooltip>
      )}
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
        <Tooltip position={positionTooltip} content={tooltipValue}>
          <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
        </Tooltip>
      )}
    </span>
  </div>
);

export const CardStatisics = ({
  title,
  value,
  icon,
  styleContainer,
  styleValue,
  styleTitle,
}) => (
  <div style={styleContainer} className="container-statistics-card">
    <span style={styleValue} className="card-statistics-value">
      {value}
    </span>
    <Pane display="flex" alignItems="center">
      <span style={styleTitle} className="card-statistics-title">
        {title}
      </span>
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
