import React, { Component } from 'react';
import {
  Indicators,
  Card,
  ContainerCard,
  CardArrow,
} from '../../components/index';

export const Difference = ({ difference, custom }) => (
  <div className={`difference-container ${custom}`}>
    <div className="difference-container-value">{difference} x</div>
    <span className="difference-container-text">more profitable now</span>
  </div>
);

const Statistics = ({
  firstLeftTitle,
  firstLeftValue,
  secondLeftTitle,
  secondLeftValue,
  secondRightTitle,
  secondRightValue,
  firstRightTitle,
  firstRightValue,
}) => (
  <ContainerCard col={4}>
    <Indicators title={firstLeftTitle} value={firstLeftValue} />
    <Indicators title={secondLeftTitle} value={secondLeftValue} />
    {/* <Card title={centerCardTitle} value={centerCardValue} /> */}
    <Indicators title={secondRightTitle} value={secondRightValue} />
    <Indicators title={firstRightTitle} value={firstRightValue} />
  </ContainerCard>
);

export default Statistics;
