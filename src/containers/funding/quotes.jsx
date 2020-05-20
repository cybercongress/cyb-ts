import React, { useEffect, useState } from 'react';
import { Pane, Avatar } from '@cybercongress/gravity';
import { LinkWindow } from '../../components';

const defaultImg = require('../../image/person-outline.svg');
const EthanBuchman = require('../../image/EthanBuchman.jpg');
const WilliamMougayar = require('../../image/WilliamMougayar.jpg');
const gavin = require('../../image/gavin.jpg');
const JaeKwon = require('../../image/JaeKwon.jpeg');
const Buterin = require('../../image/buterin.jpg');
const Juan = require('../../image/juan.png');
const BrianFabian = require('../../image/BrianFabian.jpeg');
const OlafCarlson = require('../../image/OlafCarlson.png');
const Anonymous = require('../../image/logo-cyb-v3.svg');
const dima = require('../../image/dima.jpeg');
const dimaValera = require('../../image/dimaValera.jpeg');

const quote = [
  {
    text:
      "So I can finally get out of the business of spamming \n the web that I've done for the past 20 years, lol",
    name: 'Anonymous',
    description: 'Cyber Community Member',
    link: 'https://t.me/fuckgoogle',
    img: Anonymous,
  },
  {
    text: 'Pure web3 browser Cyb? Wonderful!',
    name: 'Gavin Wood',
    description: 'Ethereum co-founder, Building Polkadot, Web3',
    img: gavin,
    link: 'https://ipfs.io/ipfs/QmbzqDkzH73bzuB4QingYbVN9VrGFyFMgr3wbKZyBrCEs1',
  },
  {
    text:
      'Found your idea of building a decentralized google mindblowing. \n I’m glad you’ve continued working on it.',
    name: 'Brian Fabian Crain',
    description: 'Co-Founder Chorus One',
    link: 'https://medium.com/@crainbf/wonderful-post-33133f9b8e36',
    img: BrianFabian,
  },
  {
    text:
      "Crazy mofos, whatever they cook up is surely interesting.\n They shoot for the moon you didn't know exists.",
    name: 'Jae Kwon',
    description: ' Cosmos, Tendermint, IBC inventor',
    img: JaeKwon,
    link:
      'https://www.reddit.com/r/cosmosnetwork/comments/g8dqk4/apply_to_become_cybers_evangelist_and_get_rewards/',
  },
  {
    text:
      'So, you take two ipfs hashes, gather them and compute the ranks? Brilliant.',
    name: 'Ethan Buchman',
    img: EthanBuchman,
    description: 'Cosmos co-founder, Tendermint co-inventor',
  },
  {
    text:
      'Looking back, important things feel obvious. \n It takes phenomenal talent and incredible will to see them from afar. \n Those who can, define the future.',
    name: 'Dima Starodubcev',
    description: 'Original gangster of cryptofunds',
    link: 'https://twitter.com/21xhipster/status/1263098483990388736?s=09',
    img: dima,
  },
  {
    text:
      'We understand that shaking the status quo of Googles religion will be hard.\n But we must.\n As this is the only way to provide sustainable future for the next generations.',
    name: 'Dima Starodubcev and Valery Litvinv',
    description: 'Cyber inventors',
    link: 'https://ipfs.io/ipfs/QmWuKo4TR9RJyqbeK4z2FaBRvMqKfJaMNL3bXGVrswrsGf',
    img: dimaValera,
  },
  {
    text: 'Decentralized Search? Show me how!',
    name: 'Olaf Carlson-Wee',
    description: 'Polychain Founder',
    img: OlafCarlson,
  },
  {
    text:
      'Blockchains will drop search costs, \n causing a kind of decomposition that allows you to have\n markets of entities that are horizontally segregated and vertically segregated.',
    name: 'Vitalik Buterin',
    description: 'Ethereum inventor',
    link: 'https://twitter.com/eigenbros/status/1228489606250803200',
    img: Buterin,
  },
  {
    text: 'What you show is cool, but ...',
    name: 'Juan Benet',
    description: 'IPFS, Filecoin inventor',
    link: 'https://www.youtube.com/watch?v=YEQy_qcmARQ',
    img: Juan,
  },
  {
    text:
      'Will there be many blockchains? \n Yes, but many will be special-purpose, not as gen purpose as Ethereum. \n Look at search engines history.',
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
  <LinkWindow
    style={{
      minHeight: '100px',
    }}
    to={link}
  >
    <Pane
      display="flex"
      borderLeft="3px solid #3ab793e3"
      paddingY={0}
      paddingLeft={20}
      paddingRight={5}
      marginY={5}
    >
      <Pane flex={1}>
        <Pane marginBottom="5px" whiteSpace="pre-line">
          {text}
        </Pane>
        <Pane color="#fff">
          {name}, {description}
        </Pane>
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginX="5px"
        flexBasis="65px"
      >
        <Pane
          height="65px"
          width="65px"
          position="relative"
          borderRadius="9999px"
          backgroundColor="#000"
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
      </Pane>
    </Pane>
  </LinkWindow>
);

function Quotes() {
  const [activeSlide, setActiveSlide] = useState(0);
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
