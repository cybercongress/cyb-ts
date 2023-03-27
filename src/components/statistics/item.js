import React, { Component } from 'react';
import { Pane, Icon } from '@cybercongress/gravity';
import Tooltip from '../tooltip/tooltip';
import { ContainerGradientText } from '../../containers/portal/components';
import styles from './styles.scss';

// const iconHelp = require('../../image/_ionicons_svg_ios-help-circle-outline.svg');

export function ContainerCard({ children, col, styles }) {
  return (
    <div
      style={{ gridTemplateColumns: `repeat(${col}, 1fr)`, ...styles }}
      className="container-statistics"
    >
      {children}
    </div>
  );
}

export function Indicators({ title, value, tooltipValue, positionTooltip }) {
  return (
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
}

export function Card({
  title,
  value,
  tooltipValue,
  positionTooltip,
  stylesContainer,
}) {
  return (
    <div style={{ ...stylesContainer }} className="container-card">
      <span className="card-title">{value}</span>
      <span className="card-value">
        {title}{' '}
        {tooltipValue && (
          <Pane marginLeft={5}>
            <Tooltip placement={positionTooltip} tooltip={tooltipValue}>
              <Icon icon="info-sign" color="#3ab793d4" />
            </Tooltip>
          </Pane>
        )}
      </span>
    </div>
  );
}

export function CardStatisics({
  title,
  value,
  link,
  styleContainer,
  styleValue,
  styleTitle,
  tooltipValue,
  positionTooltip,
}) {
  return (
    <ContainerGradientText userStyleContent={styleContainer}>
      <div style={styleValue} className={styles.containerValue}>
        {(value || value === 0) && <div>{value}</div>}
      </div>

      {title && (
        <div className={styles.containerTextLink}>
          <div style={styleTitle} className={styles.containerText}>
            {title}
            {tooltipValue && (
              <div className={styles.containerIcon}>
                <Tooltip placement={positionTooltip} tooltip={tooltipValue}>
                  <Icon icon="info-sign" color="#3ab793d4" />
                </Tooltip>
              </div>
            )}
          </div>
          {link && <Icon icon="arrow-right" color="#4ed6ae" marginLeft={5} />}
        </div>
      )}
    </ContainerGradientText>
  );
}

export function CardArrow({ title, value, win }) {
  return (
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
}
