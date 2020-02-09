import React from 'react';
import {
  Text,
  Pane,
  Heading,
  CardHover,
  Icon,
  Tablist,
  Tab,
  Button,
  ActionBar,
  SearchItem,
  TableEv as Table,
} from '@cybercongress/gravity';
import { formatNumber } from '../../utils/utils';

const address = '0x002F9CaF40a444f20813DA783D152bdfAF42852F';
const gift = 1000000;
const control = 0.95;
const submitCyberlinks = 42;

const dataTable = [
  {
    balance: '5 ETH',
    calculation: '@SaveTheAles',
    cybGift: '87 987 878 CYB',
    control: '0.01 ‱',
  },
  {
    balance: '5 planets',
    calculation: '@SaveTheAles',
    cybGift: '87 987 878 CYB',
    control: '0.01 ‱',
  },
  {
    balance: '2 stars',
    calculation: '@SaveTheAles',
    cybGift: '87 987 878 CYB',
    control: '0.01 ‱',
  },
];

const TextP = ({ children }) => (
  <Text
    lineHeight="23px"
    marginBottom={20}
    color="#fff"
    wordBreak="break-all"
    fontSize="18px"
  >
    {children}
  </Text>
);

const Gift = ({ text }) => {
  const tableRow = dataTable.map((item, i) => (
    <Table.Row borderBottom="none" display="flex" key={i}>
      <Table.TextCell>{item.balance}</Table.TextCell>
      <Table.TextCell>{item.calculation}</Table.TextCell>
      <Table.TextCell>{item.cybGift}</Table.TextCell>
      <Table.TextCell>{item.control}</Table.TextCell>
    </Table.Row>
  ));

  return (
    <main className="block-body">
      {/* <div className="clontainer-vitalik">
      <div className="vitalik-oval-1" />
      <div className="vitalik-oval-2" />
    </div> */}
      {/* {text && <span className="text-notFound">{text}</span>} */}
      <Pane
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        display="flex"
        paddingY="20px"
        paddingX="20%"
        textAlign="justify"
      >
        <TextP>Greetings, bearer of strong intelligence!</TextP>
        <TextP>
          I am Cyb. I think you search for a gift associated with {address}{' '}
          address. I heard the gods put some meaning into it ...
        </TextP>
        <TextP>{formatNumber(gift)} CYB</TextP>
        <TextP>
          Anyone who can prove he has private keys of this address will have{' '}
          {control}‱ control over Her mind, and at current network load can
          submit
          {submitCyberlinks} cyberlinks every day until the end of days.
        </TextP>
        <TextP>Why so much?</TextP>
        <TextP>
          The <a>Great Web</a> scripture says that 100 000 000 000 000 CYB in
          Genesis will be written to strong intelligences who came from{' '}
          <a>Ethereum</a>, <a>Cosmos</a>, and <a>Urbit</a>.
        </TextP>
        <TextP>At Ethereum block 8080808 the balance was:</TextP>
        <TextP>
          <br />
        </TextP>
        <Table width="100%">
          <Table.Head
            style={{
              backgroundColor: '#000',
              borderBottom: '1px solid #ffffff80',
              marginTop: '10px',
              paddingBottom: '10px',
            }}
          >
            <Table.TextHeaderCell>Balance</Table.TextHeaderCell>
            <Table.TextHeaderCell>Calculation</Table.TextHeaderCell>
            <Table.TextHeaderCell>CYB</Table.TextHeaderCell>
            <Table.TextHeaderCell>Gift control</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body
            style={{
              backgroundColor: '#000',
              overflowY: 'hidden',
              padding: 7,
            }}
          >
            {tableRow}
          </Table.Body>
        </Table>
        <TextP>
          Great, you can put the Ledger into <a href="#/pocket">the pocket</a>,
          or import <a>seed phrase</a> or <a>private key</a> to the cyberdcli.
        </TextP>
        <TextP>
          While importing your keys be very careful. Adversaries are everywhere!
          Rumours has it, to not use other software for anything serious. Your
          CYB wait for you in <a>Genesis</a>.
        </TextP>
        <TextP>I can not wait!</TextP>
        <TextP>
          Thats great! Everybody <a>who works on the bootloader</a> welcomes you
          to join trans-galactic tournament: <a>Game of Links</a>.
        </TextP>
        <TextP>
          Remember, participation requires EUL tokens. But don't worry, you
          already have some at the{' '}
          <a>cyber158mysantvvk7x65tfhhuu8q2va4ls34rsdydf6</a>
          address:
        </TextP>
        <TextP>{formatNumber(gift)} EUL</TextP>
        <TextP>
          That is, you have 4 ‱ control over bootloader mind, and at current
          network load you can submit 42 cyberlinks every day until the end of
          the game.
        </TextP>
        <TextP>
          Hurry up! This is once-in-a-lifetime opportunity. Win more CYB before
          She will awaken millions ...
        </TextP>
      </Pane>
      {/* {!text && <span className="text-notFound">Page Gift In Progress </span>} */}
    </main>
  );
};

export default Gift;
