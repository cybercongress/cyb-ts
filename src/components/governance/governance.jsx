import React from 'react';
import { Pane, Text, TableEv as Table, Tooltip } from '@cybercongress/gravity';

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
      verticalAlign="middle"
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
