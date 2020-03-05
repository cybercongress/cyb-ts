import React, { useEffect, useState } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import {
  getDrop,
  getTotalSupply,
  getCurrentBandwidthPrice,
  getAccountBandwidth,
} from '../../utils/search/utils';
import { Loading } from '../../components';
import {
  GENESIS_SUPPLY,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_ETH,
} from '../../utils/config';
import { formatValidatorAddress, formatNumber } from '../../utils/utils';
import GiftTable from './tableGift';

const LinkWindow = ({ to, children }) => (
  <a target="_blank" rel="noopener noreferrer" href={to}>
    {children}
  </a>
);

const TextCustom = ({ fontSize, children, ...props }) => (
  <Text
    lineHeight="23px"
    marginBottom={20}
    color="#fff"
    fontSize={fontSize || '18px'}
    {...props}
  >
    {children}
  </Text>
);

const Address = ({ address }) => {
  if (address.match(PATTERN_COSMOS)) {
    return (
      <LinkWindow to={`https://www.mintscan.io/account/${address}`}>
        {formatValidatorAddress(address, 10, 6)}
      </LinkWindow>
    );
  }
  if (address.match(PATTERN_ETH)) {
    return (
      <LinkWindow to={`http://etherscan.io/address/${address}`}>
        {formatValidatorAddress(address, 10, 6)}
      </LinkWindow>
    );
  }
  return <div>{formatValidatorAddress(address, 12, 6)}</div>;
};

const drop = {
  address: '0xe8298160c9e8cabd8f2711b92529e0afe8fb01fb',
  cyberAddress: 'cyber177gvvqtn7xl8qvl6yw4vax9raz80fx66aukc94',
  gift: 50372509,
  drop: [
    { bal: 2.0692081959594533, gift: 50372509, type: 'ethereum' },
    { bal: 4, gift: 34346346, type: 'galaxies' },
    { bal: 5, gift: 3453463, type: 'stars' },
    { bal: 1, gift: 44534634, type: 'planets' },
    { bal: 5421215, gift: 3453463, type: 'euler-4' },
    { bal: 2781522660, gift: 3609175008, type: 'cosmos' },
  ],
};

// const drop = [];

function GiftAddress({ address }) {
  // const [drop, setDrop] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     const response = await getDrop(address.toLowerCase());
  //     if (response !== 0) {
  //       setDrop({
  //         address,
  //         ...response,
  //       });
  //       setLoading(false);
  //     } else {
  //       setDrop([]);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [address]);

  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         height: '50vh',
  //       }}
  //       className="container-loading"
  //     >
  //       <Loading />
  //     </div>
  //   );
  // }

  // console.log(drop);

  if (Object.keys(drop).length === 0) {
    return <main className="block-body">no gift</main>;
  }

  return (
    <main className="block-body">
      <Pane
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        display="flex"
        paddingY="20px"
        paddingX="20%"
        textAlign="justify"
      >
        <TextCustom>Greetings, bearer of strong intelligence!</TextCustom>
        <TextCustom>
          I am Cyb. I think you search for a gift associated with{' '}
          <Address address={address} /> address. I heard the gods put some
          meaning into it ...
        </TextCustom>
        <TextCustom width="100%">{`${formatNumber(drop.gift)} CYB`}</TextCustom>
        <TextCustom>
          Anyone who can prove he has private keys of this address will have{' '}
          {formatNumber((drop.gift / GENESIS_SUPPLY) * 100, 4)} ‱ control over
          Her mind, and at current network load can submit 42 cyberlinks every
          day until the end of days.
        </TextCustom>
        <TextCustom width="100%" fontSize="23px">
          Why so much?
        </TextCustom>
        <TextCustom>
          The{' '}
          <LinkWindow to="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ">
            Great Web scripture
          </LinkWindow>{' '}
          says that {formatNumber(GENESIS_SUPPLY)} CYB in Genesis will be
          written to strong intelligences who came from{' '}
          <LinkWindow to="https://ethereum.org/">Ethereum</LinkWindow>,{' '}
          <LinkWindow to="https://cosmos.network/">Cosmos</LinkWindow>, and{' '}
          <LinkWindow to="https://urbit.org/">Urbit</LinkWindow>.
        </TextCustom>

        {!drop.address.match(PATTERN_COSMOS) && (
          <TextCustom width="100%">
            At Ethereum block {formatNumber(8080808)} the balance was:
          </TextCustom>
        )}
        <GiftTable data={drop.drop} />
        <TextCustom width="100%" fontSize="23px">
          I have the keys!
        </TextCustom>
        <TextCustom>
          Great, you can put the Ledger into the{' '}
          <Link to="/pocket">pocket</Link>, or import{' '}
          <LinkWindow to="https://cybercongress.ai/docs/cyberd/ultimate-commands-guide/#import-an-account-by-seed-phrase-and-store-it-in-local-keystore">
            seed phrase
          </LinkWindow>{' '}
          or{' '}
          <LinkWindow to="https://cybercongress.ai/docs/cyberd/ultimate-commands-guide/#import-an-account-by-private-key-and-store-it-in-local-keystore-private-key-could-be-your-eth-private-key">
            private key
          </LinkWindow>{' '}
          to the cyberdcli.
        </TextCustom>
        <TextCustom>
          While importing your keys be very careful. Adversaries are everywhere!
          Rumours has it, to not use other software for anything serious. Your
          CYB wait for you in <Link to="/">Genesis</Link>.
        </TextCustom>
        <TextCustom width="100%" fontSize="23px">
          I can not wait!
        </TextCustom>
        <TextCustom>
          Thats great! Everybody{' '}
          <Link to="/episode-1">who works on the bootloader</Link> welcomes you
          to join trans-galactic tournament:{' '}
          <Link to="/gol">Game of Links</Link>.
        </TextCustom>
        <TextCustom>
          Remember, participation requires bootstrap fuel - EUL tokens. But
          don&lsquo;t worry, you already have some at the{' '}
          <Link to={`/network/euler-5/contract/${drop.cyberAddress}`}>
            {formatValidatorAddress(drop.cyberAddress, 10, 6)}
          </Link>{' '}
          contract:
        </TextCustom>
        <TextCustom width="100%">{`${formatNumber(
          drop.gift
        )} ${CYBER.DENOM_CYBER.toUpperCase()}`}</TextCustom>
        <TextCustom>
          That is, you have{' '}
          {formatNumber((drop.gift / GENESIS_SUPPLY) * 100, 4)} ‱ control over
          bootloader mind, and at current network load you can submit 42
          cyberlinks every day until the end of the game.
        </TextCustom>
      </Pane>
    </main>
  );
}

export default GiftAddress;
