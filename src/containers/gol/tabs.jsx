import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroller';
import { Loading } from '../../components';
import { DISTRIBUTION, GENESIS_SUPPLY } from '../../utils/config';

export const Delegation = () => (
  <Pane
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    display="flex"
    paddingY="20px"
    paddingX="20%"
    textAlign="justify"
    width="100%"
  >
    <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
      Get more voting power for your validator - get more rewards!
    </Text>
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      This disciplines is social discipline with max prize of 5 TCYB. Huge chunk
      of CYB stake allocated to all Ethereans and Cosmonauts. The more you
      spread, the more users will claim its allocation, the more voting power as
      validators you will have in Genesis. Details of reward calculation you can
      find in{' '}
      <a target="_blank" href="https://cybercongress.ai/game-of-links/">
        Game of Links rules
      </a>
    </Text>
  </Pane>
);

export const Load = () => (
  <Pane
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    display="flex"
    paddingY="20px"
    paddingX="20%"
    textAlign="justify"
    width="100%"
  >
    <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
      Submit as much cyberlinks as possible!
    </Text>
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      We need to test the network under heavy load. Testing of decentralized
      networks under load near real conditions is hard and expensive. So we
      invite you to submit as much cyberlinks as possible. Max reward for this
      discipline is 6 TCYB. Details of reward calculation you can find in{' '}
      <a target="_blank" href="https://cybercongress.ai/game-of-links/">
        Game of Links rules
      </a>
    </Text>
  </Pane>
);

export const Uptime = () => (
  <Pane
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    display="flex"
    paddingY="20px"
    paddingX="20%"
    textAlign="justify"
    width="100%"
  >
    <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
      Setup you validator and get rewards for precommit counts!
    </Text>
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      Max rewards for uptime is 2 TCYB.{' '}
      <a
        target="_blank"
        href="https://cybercongress.ai/docs/cyberd/run_validator/"
      >
        Run validator, become the hero!
      </a>
    </Text>
  </Pane>
);
export const FVS = () => (
  <Pane
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    display="flex"
    paddingY="20px"
    paddingX="20%"
    textAlign="justify"
    width="100%"
  >
    <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
      Go on and convince your friend to become a hero!
    </Text>
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      Full Validator Set discipline. We want to bootstrap the cyber main network
      with full validators set. So we assign group bonus to all validators for
      self-organization. If the set of validators will increase over or is equal
      to 100, and this number of validators can last for 10000 blocks, we will
      allocate an additional 2 TCYB to validators who take part in genesis. If
      the number of validators will increase to or over 146, under the same
      conditions we will allocate an additional 3 TCYB. All rewards in that
      discipline will be distributed to validators per capita. Details of reward
      calculation you can find in{' '}
      <a target="_blank" href="https://cybercongress.ai/game-of-links/">
        Game of Links rules
      </a>
    </Text>
  </Pane>
);
export const Euler4 = () => (
  <Pane
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    display="flex"
    paddingY="20px"
    paddingX="20%"
    textAlign="justify"
    width="100%"
  >
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      Oh! You miss the boat. This discipline is the reward for validators who
      helped us test the network during 2019 year. Thank you for participation.
    </Text>
  </Pane>
);

export const Community = () => (
  <Pane
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    display="flex"
    paddingY="20px"
    paddingX="20%"
    textAlign="justify"
    width="100%"
  >
    <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
      Propose something that matters!
    </Text>
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      2 TEUL allocated to community pool in euler. All governance payouts will
      be migrated to main network. That means that up to 2 TCYB can be allocated
      for community proposals during Game of Links.{' '}
      <a target="_blank" href="https://cybercongress.ai/game-of-links/">
        Details here
      </a>
    </Text>
  </Pane>
);

export const Takeoff = () => (
  <Pane
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    display="flex"
    paddingY="20px"
    paddingX="20%"
    textAlign="justify"
    width="100%"
  >
    <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
      Help sustain the project, get the will!
    </Text>
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      Without takeoff round it is impossible for cyber•Congress to continue
      development of the project. Overall Game of Links rewards depends on the
      Takeoff donations results. Takeoff round will be launched after the
      network accept the proposal with the hash of the cyber.page app with
      donation functionality. Details of Takeoff donations in{' '}
      <a target="_blank" href="https://cybercongress.ai/game-of-links/">
        Game of Links
      </a>{' '}
      rules. Subscribe to our{' '}
      <a target="_blank" href="https://cybercongress.ai/post/">
        blog
      </a>{' '}
      to get updates.
    </Text>
  </Pane>
);

export const Relevance = ({ hasMoreItems, showItems, loadMore }) => (
  <Pane width="100%">
    <Pane textAlign="center" marginBottom={10} paddingX="20%" width="100%">
      <Text lineHeight="24px" color="#fff" fontSize="18px">
        Submit the most ranked content first!
        <br /> Details of reward calculation you can find in{' '}
        <a target="_blank" href="https://cybercongress.ai/game-of-links/">
          Game of Links rules
        </a>
      </Text>
    </Pane>
  </Pane>
);
