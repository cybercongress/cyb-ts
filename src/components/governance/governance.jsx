import React from 'react';
import { Pane, Text, Tooltip } from '@cybercongress/gravity';
import { formatNumber } from '../../utils/search/utils';
import { CYBER } from '../../utils/config';

const submitted = require('../../image/ionicons_svg_ios-battery-full.svg');
const voting = require('../../image/ionicons_svg_ios-people.svg');
const passed = require('../../image/ionicons_svg_ios-checkmark-circle.svg');
const rejected = require('../../image/ionicons_svg_ios-close-circle.svg');
const failed = require('../../image/ionicons_svg_ios-remove-circle.svg');
const defaultIcon = require('../../image/ionicons_svg_ios-warning.svg');

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};

export const Legend = ({ color, text, ...props }) => (
  <Pane display="flex" alignItems="center" {...props}>
    <Pane
      width={12}
      height={12}
      borderRadius="2px"
      display="inline-block"
      marginRight={10}
      backgroundColor={color}
      verticalalign="middle"
    />
    <Text color="#fff" fontSize="16px">
      {text}
    </Text>
  </Pane>
);

export const Votes = ({ finalVotes }) => (
  <Pane
    backgroundColor="#ffffff14"
    borderRadius={5}
    overflow="hidden"
    height={10}
    width="100%"
    display="flex"
  >
    <Tooltip
      content={`Yes: ${toFixedNumber(finalVotes.yes, 2)}%`}
      position="top"
    >
      <Pane
        backgroundColor="#3ab793"
        display="flex"
        height="100%"
        width={`${finalVotes.yes}%`}
      />
    </Tooltip>
    <Tooltip
      content={`Abstain: ${toFixedNumber(finalVotes.abstain, 2)}%`}
      position="top"
    >
      <Pane
        backgroundColor="#ccdcff"
        display="flex"
        height="100%"
        width={`${finalVotes.abstain}%`}
      />
    </Tooltip>
    <Tooltip content={`No: ${toFixedNumber(finalVotes.no, 2)}%`} position="top">
      <Pane
        backgroundColor="#ffcf65"
        display="flex"
        height="100%"
        width={`${finalVotes.no}%`}
      />
    </Tooltip>
    <Tooltip
      content={`NoWithVeto: ${toFixedNumber(finalVotes.noWithVeto, 2)}%`}
      position="top"
    >
      <Pane
        backgroundColor="#fe8a8a"
        display="flex"
        height="100%"
        width={`${finalVotes.noWithVeto}%`}
      />
    </Tooltip>
  </Pane>
);

export const IconStatus = ({ status, size, ...props }) => {
  let imgIcon;
  switch (status) {
    case 'DepositPeriod': {
      imgIcon = submitted;
      break;
    }
    case 'VotingPeriod': {
      imgIcon = voting;
      break;
    }
    case 'Passed': {
      imgIcon = passed;
      break;
    }
    case 'Rejected': {
      imgIcon = rejected;
      break;
    }
    case 'Failed': {
      imgIcon = failed;
      break;
    }
    default: {
      imgIcon = defaultIcon;
    }
  }
  return (
    <Pane width={size || 20} height={size || 20} {...props}>
      <img src={imgIcon} alt="icon" />
    </Pane>
  );
};

export const Deposit = ({ totalDeposit, minDeposit }) => {
  let procentDeposit = 0;

  if (totalDeposit > minDeposit) {
    procentDeposit = (minDeposit / totalDeposit) * 100;
  } else {
    procentDeposit = (totalDeposit / minDeposit) * 100;
  }

  return (
    <Pane
      backgroundColor="#ffffff14"
      borderRadius={5}
      overflow="visible"
      height={10}
      width="100%"
      display="flex"
      position="relative"
    >
      <Pane
        backgroundColor="#3ab793"
        display="flex"
        height="100%"
        borderRadius={5}
        position="absolute"
        width={`${totalDeposit < minDeposit ? procentDeposit : 100}%`}
      >
        <Pane position="absolute" left="100%" top="20px">
          <Text
            whiteSpace="nowrap"
            color="#fff"
            position="relative"
            right="50%"
            width="100%"
            className="tooltip-text-deposit"
          >
            Total Deposit {formatNumber(totalDeposit * 10 ** -9)}{' '}
            {CYBER.DENOM_CYBER_G}
          </Text>
        </Pane>
      </Pane>

      {totalDeposit > minDeposit && (
        <Pane
          backgroundColor="#007bff"
          display="flex"
          height="100%"
          borderRadius={5}
          position="absolute"
          zIndex={1}
          right={0}
          width={`${100 - procentDeposit}%`}
        />
      )}
    </Pane>
  );
};

export const ContainerPane = ({ children, ...props }) => (
  <Pane {...props} paddingX={20} paddingY={20} boxShadow="0 0 3px 0px #3ab793">
    {children}
  </Pane>
);

export const Item = ({ title, value, ...props }) => (
  <Pane {...props} display="flex">
    <Text minWidth="150px" color="#fff" fontSize="16px">
      {title}:{' '}
    </Text>
    <Text color="#fff" fontSize="16px">
      {value}
    </Text>
  </Pane>
);
