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
      This disciplines is a social discipline with a max prize of 5 TCYB. A huge chunk
      of the CYB stake is allocated to all Ethereans and Cosmonauts. The more you
      spread the word, the more users will claim their allocation, the more voting power as
      a validator you will have in the Genesis. You can find the details of the
      reward calculations in the{' '}
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
      Submit as many cyberlinks as possible!
    </Text>
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      We need to test the network under heavy load. The testing of decentralized
      networks under load, near real conditions is difficult and expensive. We
      invite you to submit as many cyberlinks as possible. The max reward for this
      discipline is 6 TCYB. Details of the reward calculation can be found in the{' '}
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
      Setup you validator and get rewards for precommits!
    </Text>
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      The max rewards for the uptime discipline is 2 TCYB.{' '}
      <a
        target="_blank"
        href="https://cybercongress.ai/docs/cyberd/run_validator/"
      >
        Run a validator, become a hero!
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
      Go on and convince your friends to become heroes!
    </Text>
    <Text lineHeight="24px" color="#fff" fontSize="18px">
      Full Validator Set discipline. We want to bootstrap the mainnet of cyber 
      with a full validators set. We have assigned a group bonus to all validators for
      self-organization. If the set of validators will increase to over or is equal
      to 100, and this number of validators will last for 10000 blocks, we will
      allocate an additional 2 TCYB to validators who take part in genesis. If
      the number of validators will increase to or over 146, under the same
      conditions we will allocate an additional 3 TCYB. All of the rewards for this
      discipline will be distributed to validators per capita. Details of the reward
      calculations may be seen in the{' '}
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
      Oh! You missed the boat. This discipline is the reward for validators who
      helped us to test the network during 2019. Thank you for participation.
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
      2 TEUL are allocated to the community pool during the euler epoch. All governance payouts will
      be migrated to the main network. This means that up to 2 TCYB can be allocated
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
      network accept the proposal with the hash of the cyb.ai app with
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
