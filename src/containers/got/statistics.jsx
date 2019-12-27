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
  <ContainerCard styles={{ gridGap: '25px' }} col={4}>
    <Card title={firstLeftTitle} value={firstLeftValue} />
    <Card title={secondLeftTitle} value={secondLeftValue} />
    {/* <Card title={centerCardTitle} value={centerCardValue} /> */}
    <Card title={secondRightTitle} value={secondRightValue} />
    <Card title={firstRightTitle} value={firstRightValue} />
  </ContainerCard>
);

export default Statistics;
