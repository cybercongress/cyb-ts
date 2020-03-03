import React, { useEffect, useState } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { getDrop } from '../../utils/search/utils';
import { Loading } from '../../components';
import { GENESIS_SUPPLY, CYBER } from '../../utils/config';
import { formatValidatorAddress, formatNumber } from '../../utils/utils';
import GiftTable from './tableGift';

const TextCustom = ({ fontSize, children }) => (
  <Text
    lineHeight="23px"
    marginBottom={20}
    color="#fff"
    fontSize={fontSize || '18px'}
  >
    {children}
  </Text>
);

const drop = {
  address: '0xe8298160c9e8cabd8f2711b92529e0afe8fb01fb',
  cyberAddress: 'cyber177gvvqtn7xl8qvl6yw4vax9raz80fx66aukc94',
  gift: 50372509,
  drop: [
    { ethereum_bal: 2.0692081959594533, ethereum_gift: 50372509 },
    { galaxies: 4, galaxies_gift: 34346346 },
    { stars: 5, stars_gift: 3453463 },
    { planets: 1, planets_gift: 44534634 },
  ],
};

function GiftAddress({ address }) {
  // const [drop, setDrop] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     const response = await getDrop(address.toLowerCase());
  //     setLoading(false);
  //     if (response !== 0) {
  //       const { cyber_address: cyberAddress, gift, ...dropObj } = response;
  //       setDrop({
  //         address,
  //         cyberAddress,
  //         gift,
  //         drop: {
  //           ...dropObj,
  //         },
  //       });
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
          {formatValidatorAddress(address, 10, 6)} address. I heard the gods put
          some meaning into it ...
        </TextCustom>
        <TextCustom>{`${formatNumber(
          drop.gift
        )} ${CYBER.DENOM_CYBER.toUpperCase()}`}</TextCustom>
        <TextCustom>
          Anyone who can prove he has private keys of this address will have{' '}
          {formatNumber((drop.gift / GENESIS_SUPPLY) * 100, 6)} ‱ control over
          Her mind, and at current network load can submit 42 cyberlinks every
          day until the end of days.
        </TextCustom>
        <TextCustom fontSize="23px">Why so much?</TextCustom>
        <TextCustom>
          The Great Web scripture says that {GENESIS_SUPPLY} CYB in Genesis will
          be written to strong intelligences who came from Ethereum, Cosmos, and
          Urbit.
        </TextCustom>
        <TextCustom>At Ethereum block 8080808 the balance was:</TextCustom>
        <GiftTable data={drop.drop} />
        <TextCustom fontSize="23px">I have the keys!</TextCustom>
        <TextCustom>
          Great, you can put the Ledger into the pocket, or import seed phrase
          or private key to the cyberdcli.
        </TextCustom>
        <TextCustom>
          While importing your keys be very careful. Adversaries are everywhere!
          Rumours has it, to not use other software for anything serious. Your
          CYB wait for you in Genesis.
        </TextCustom>
        <TextCustom fontSize="23px">I can not wait!</TextCustom>
        <TextCustom>
          Thats great! Everybody who works on the bootloader welcomes you to
          join trans-galactic tournament: Game of Links.
        </TextCustom>
        <TextCustom>
          Remember, participation requires bootstrap fuel - EUL tokens. But
          don&lsquo;t worry, you already have some at the{' '}
          {formatValidatorAddress(drop.cyberAddress, 10, 6)} address:
        </TextCustom>
        <TextCustom>{`${formatNumber(
          drop.gift
        )} ${CYBER.DENOM_CYBER.toUpperCase()}`}</TextCustom>
        <TextCustom>
          That is, you have 4 ‱ control over bootloader mind, and at current
          network load you can submit 42 cyberlinks every day until the end of
          the game.
        </TextCustom>
      </Pane>
    </main>
  );
}

export default GiftAddress;
