import React from 'react';
import { Pane, Text, Tooltip, Icon } from '@cybercongress/gravity';
import { PocketCard } from '../components';
import { trimString } from '../../../utils/utils';

function ImportLinkLedger({
  link,
  selectedIndex,
  selectLink,
  countLink,
  ...props
}) {
  console.log(link);
  return (
    <PocketCard {...props}>
      <Text fontSize="16px" marginBottom={10} color="#fff">
        You created {link !== null && countLink} cyberlinks in euler-5. Import
        Ledger
      </Text>
      <Pane width="100%" display="grid">
        {link.map((item, index) => {
          const content = item.map((itemLink, j) => (
            <Pane display="flex" fontSize={13} key={j}>
              <Pane whiteSpace="nowrap" marginRight={5}>
                from: {trimString(itemLink.from, 4, 4)}
              </Pane>
              <Pane whiteSpace="nowrap">
                to: {trimString(itemLink.to, 4, 4)}
              </Pane>
            </Pane>
          ));
          return (
            <Pane
              onClick={() => selectLink(item, index)}
              display="flex"
              paddingX={8}
              paddingY={5}
              className="hover-row"
              boxShadow={index === selectedIndex ? '0px 0px 7px #3ab793db' : ''}
              width="100%"
              key={index}
            >
              <Pane flex={1}>cyberLinks</Pane>
              <Pane display="flex" alignItems="center">
                {item.length}
                <Tooltip position="bottom" content={content}>
                  <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
                </Tooltip>
              </Pane>
            </Pane>
          );
        })}
      </Pane>
    </PocketCard>
  );
}

export default ImportLinkLedger;
