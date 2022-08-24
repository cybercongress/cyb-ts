import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { formatNumber } from '../../utils/search/utils';
import { CYBER, PROPOSAL_STATUS } from '../../utils/config';
import { Tooltip } from '../tooltip/tooltip';

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

export const Votes = ({ finalVotes }) => {
  try {
    return (
      <Pane
        backgroundColor="#ffffff14"
        borderRadius={5}
        overflow="hidden"
        height={10}
        width="100%"
        display="flex"
      >
        <Pane display="flex" height="100%" width={`${finalVotes.yes}%`}>
          <Tooltip placement="top" tooltip={<Pane>Yes: %</Pane>}>
            <Pane
              backgroundColor="#3ab793"
              display="flex"
              height="100%"
              width="100%"
            />
          </Tooltip>
        </Pane>
        <Pane display="flex" height="100%" width={`${finalVotes.abstain}%`}>
          <Tooltip
            tooltip={`Abstain: ${toFixedNumber(finalVotes.abstain, 2)}%`}
            placement="top"
          >
            <Pane
              backgroundColor="#ccdcff"
              display="flex"
              height="100%"
              width="100%"
              // width={`${finalVotes.abstain}%`}
            />
          </Tooltip>
        </Pane>
        <Pane display="flex" height="100%" width={`${finalVotes.no}%`}>
          <Tooltip
            tooltip={`No: ${toFixedNumber(finalVotes.no, 2)}%`}
            placement="top"
          >
            <Pane
              backgroundColor="#ffcf65"
              display="flex"
              height="100%"
              width="100%"
              // width={`${finalVotes.no}%`}
            />
          </Tooltip>
        </Pane>
        <Pane display="flex" height="100%" width={`${finalVotes.noWithVeto}%`}>
          <Tooltip
            tooltip={`NoWithVeto: ${toFixedNumber(finalVotes.noWithVeto, 2)}%`}
            placement="top"
          >
            <Pane
              backgroundColor="#fe8a8a"
              display="flex"
              height="100%"
              width="100%"
              // width={`${finalVotes.noWithVeto}%`}
            />
          </Tooltip>
        </Pane>
      </Pane>
    );
  } catch (error) {
    return (
      <Pane
        backgroundColor="#ffffff14"
        borderRadius={5}
        overflow="hidden"
        height={10}
        width="100%"
        display="flex"
      >
        <Pane display="flex" height="100%" width={0}>
          <Tooltip placement="top" tooltip="Yes: 0%">
            <Pane
              backgroundColor="#3ab793"
              display="flex"
              height="100%"
              width={0}
            />
          </Tooltip>
        </Pane>
        <Pane display="flex" height="100%" width={0}>
          <Tooltip tooltip="Abstain: 0%" placement="top">
            <Pane
              backgroundColor="#ccdcff"
              display="flex"
              height="100%"
              width={0}
            />
          </Tooltip>
        </Pane>
        <Pane display="flex" height="100%" width={0}>
          <Tooltip tooltip="No: 0%" placement="top">
            <Pane
              backgroundColor="#ffcf65"
              display="flex"
              height="100%"
              width={0}
            />
          </Tooltip>
        </Pane>
        <Pane display="flex" height="100%" width={0}>
          <Tooltip tooltip="NoWithVeto: 0%" placement="top">
            <Pane
              backgroundColor="#fe8a8a"
              display="flex"
              height="100%"
              width={0}
            />
          </Tooltip>
        </Pane>
      </Pane>
    );
  }
};

export const IconStatus = ({ status, size, text, ...props }) => {
  let imgIcon;
  let statusText = '';

  switch (status) {
    case PROPOSAL_STATUS.PROPOSAL_STATUS_DEPOSIT_PERIOD: {
      imgIcon = submitted;
      statusText = 'deposit period';
      break;
    }
    case PROPOSAL_STATUS.PROPOSAL_STATUS_VOTING_PERIOD: {
      imgIcon = voting;
      statusText = 'voting period';
      break;
    }
    case PROPOSAL_STATUS.PROPOSAL_STATUS_PASSED: {
      imgIcon = passed;
      statusText = 'passed';
      break;
    }
    case PROPOSAL_STATUS.PROPOSAL_STATUS_REJECTED: {
      imgIcon = rejected;
      statusText = 'rejected';
      break;
    }
    case PROPOSAL_STATUS.PROPOSAL_STATUS_FAILED: {
      imgIcon = failed;
      statusText = 'failed';
      break;
    }
    default: {
      imgIcon = defaultIcon;
    }
  }
  return (
    <Pane display="flex" alignItems="center" {...props}>
      <Pane marginRight={5} width={size || 20} height={size || 20}>
        <img src={imgIcon} alt="icon" />
      </Pane>
      {text && (
        <Text fontSize="16px" color="#fff">
          {statusText}
        </Text>
      )}
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
            Total Deposit {formatNumber(totalDeposit)}{' '}
            {CYBER.DENOM_CYBER.toUpperCase()}
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
  <Pane {...props} paddingX={30} paddingY={20} boxShadow="0 0 3px 0px #3ab793">
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
