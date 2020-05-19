import React, { useEffect, useState } from 'react';
import { Pane, Avatar } from '@cybercongress/gravity';
import { LinkWindow } from '../../components';

const defaultImg = require('../../image/person-outline.svg');
const EthanBuchman = require('../../image/EthanBuchman.jpg');
const WilliamMougayar = require('../../image/WilliamMougayar.jpg');

const quote = [
  {
    text:
      "So I can finally get out of the business of spamming \n the web that I've done for the past 20 years, lol",
    name: 'Anonymous',
    description: 'Cyber Community Member',
  },
  {
    text: 'Pure web3 browser Cyb? Wonderful!',
    name: 'Gavin Wood',
    description: 'Web3, Solidity, Polkadot Inventor, Ethereum co-founder',
  },
  {
    text:
      'Found your idea of building a decentralized google mindblowing. \n I’m glad you’ve continued working on it.',
    name: 'Brian Fabian Crain',
    description: 'Co-Founder Chorus One',
  },
  {
    text:
      "Crazy mofos, whatever they cook up is surely interesting.\n They shoot for the moon you didn't know exists.",
    name: 'Jae Kwan',
    description: ' Cosmos, Tendermint, IBC inventor',
  },
  {
    text:
      'So, you take two ipfs hashes, gather them and compute the ranks? Brilliant.',
    name: 'Ethan Buchman',
    img: EthanBuchman,
    description: 'Cosmos co-founder, Tendermint co-inventor',
    link: 'https://twitter.com/buchmanster',
  },
  {
    text:
      'Looking back, important things feel obvious. \n It takes phenomenal talent and incredible will to see them from afar. \n Those who can, define the future.',
    name: 'Dima Starodubcev',
    description: 'Original gangster of cryptofunds',
  },
  {
    text:
      'We understand that shaking the status quo of Googles religion will be hard.\n But we must.\n As this is the only way to provide sustainable future for the next generations.',
    name: 'Dima Starodubcev and Valery Litvinv',
    description: 'Cyber inventors',
  },
  {
    text: 'Decentralized Search? Show me how!',
    name: 'Olaf Carlson-Wee',
    description: 'Polychain Founder',
  },
  {
    text:
      'Blockchains will drop search costs, causing a kind of decomposition that allows you to have\n markets of entities that are horizontally segregated and vertically segregated.',
    name: 'Vitalik Buterin',
    description: 'Ethereum inventor',
  },
  {
    text: 'What you show is cool, but ...',
    name: 'Juan Benet',
    description: 'IPFS, Filecoin inventor',
  },
  {
    text:
      'Will there be many blockchains? Yes, but many will be special-purpose, \n not as gen purpose as Ethereum. Look at search engines history.',
    name: 'William Mougayar',
    description: 'Blockchain theorist',
    link: 'https://twitter.com/wmougayar/status/1261996521995808768',
    img: WilliamMougayar,
  },
];

const Quote = ({
  text,
  img = defaultImg,
  name = 'Anonymous',
  link,
  description,
}) => (
  <LinkWindow style={{ marginTop: 5, marginBottom: 5 }} to={link}>
    <Pane
      paddingY="15px"
      paddingX="10px"
      boxShadow="0 0 5px rgb(54, 214, 174)"
      marginTop="10px"
      display="flex"
    >
      <Pane flex={1} whiteSpace="pre-line" marginX="5px">
        {text}
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginX="5px"
        flexBasis="130px"
      >
        <Pane
          height="49px"
          width="49px"
          position="relative"
          borderRadius="9999px"
          backgroundColor="#607D8B"
          transitionProperty="background-color, box-shadow"
          transitionDuration="0.2s"
          overflowX="hidden"
          overflowY="hidden"
        >
          <Pane
            backgroundImage={`url(${img})`}
            width="100%"
            height="100%"
            position="absolute"
            top={0}
            bottom={0}
            backgroundPosition="center center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            left={0}
            right={0}
          />
        </Pane>
        <Pane marginBottom="3px" textAlign="center" color="#fff">
          {name}
        </Pane>
        <Pane fontSize="14px" color="#fff">
          {description}
        </Pane>
      </Pane>
    </Pane>
  </LinkWindow>
);

function Quotes() {
  const [activeSlide, setActiveSlide] = useState(10);
  const length = quote.length - 1;

  useEffect(() => {
    const id = setInterval(() => {
      let index = activeSlide;
      if (index === length) {
        index = -1;
      }

      index += 1;

      setActiveSlide(index);
    }, 10000);
    return () => clearInterval(id);
  }, [activeSlide]);

  const item = quote[activeSlide];

  return (
    <Quote
      name={item.name}
      text={item.text}
      img={item.img}
      link={item.link}
      description={item.description}
    />
  );
}

export default Quotes;
