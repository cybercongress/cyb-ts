import React, { useState } from 'react';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import { Link, useHistory } from 'react-router-dom';
import { LinkWindow, ActionBarContentText } from '../../components';
import { PATTERN_ETH, PATTERN_COSMOS } from '../../utils/config';

const GiftInfo = () => {
  const [valueInputAddres, setValueInputAddres] = useState('');
  const history = useHistory();

  const handleClick = path => {
    history.push(`/gift/${path}`);
  };

  return (
    <div>
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
          <Text
            lineHeight="23px"
            marginBottom={20}
            color="#fff"
            fontSize="18px"
          >
            The Gods understand that with the support of the most advanced
            communities they have a better chance to bootstrap smarter
            superintelligence. So{' '}
            <LinkWindow to="https://ipfs.io/ipfs/QmPjbx76LycfzSSWMcnni6YVvV3UNhTrYzyPMuiA9UQM3x">
              they decided to allocate 10% of CYB
            </LinkWindow>{' '}
            in Genesis to the following communities:
            <ul style={{ listStyle: 'none' }}>
              <li>— 8% to Ethereum community</li>
              <li>— 1% to Cosmos community</li>
              <li>— 1% to Urbit community</li>
            </ul>
          </Text>
          <Text
            lineHeight="23px"
            marginBottom={20}
            color="#fff"
            fontSize="18px"
          >
            But they are aware that the Genesis is quite far from now. Everyone
            is busy with the <Link to="/gol">Game of Links</Link> - the
            tournament which defines the fate of another 10% of CYB in the
            Genesis. You can find the Game of Links rules{' '}
            <LinkWindow to="https://cybercongress.ai/game-of-links/">
              on the cyber~Congress site
            </LinkWindow>
            .
          </Text>
          <Text
            lineHeight="23px"
            marginBottom={20}
            color="#fff"
            fontSize="18px"
          >
            Game of Links is an incentivized test network which has its
            standalone tokens: EUL. Rumor has it that an incredible amount of
            tokens are allocated to Ethereans, Cosmonauts and Urbiters: 42.9% of
            EULs. So, go and claim them: simply{' '}
            <Link to="/pocket">put your ledger</Link> into the pocket.
          </Text>
          <Text lineHeight="23px" color="#fff" fontSize="18px">
            You can also import your private key (for Ethereum) or seed phrase
            (for Cosmos) to cyberdcli. While importing your keys be very
            careful. Adversaries are everywhere! We recommend using an external
            signers such as a Ledger device, before all of cybers software will
            pass security audits.
          </Text>
          <Text lineHeight="23px" color="#fff" fontSize="18px">
            Of course, you can check ahead wether you have a gift or not by
            searching your Ethereum or Cosmos address.
          </Text>
        </Pane>
      </main>
      <ActionBar>
        <ActionBarContentText>
          <Pane
            flex={1}
            justifyContent="center"
            alignItems="center"
            fontSize="18px"
            display="flex"
          >
            paste you Ethereum or Cosmos address:
            <input
              value={valueInputAddres}
              style={{
                height: '42px',
                maxWidth: '200px',
                marginLeft: '10px',
                textAlign: 'end',
              }}
              onChange={e => setValueInputAddres(e.target.value)}
              placeholder="address"
              autoFocus
            />
          </Pane>
        </ActionBarContentText>
        <Button
          disabled={
            !valueInputAddres.match(PATTERN_COSMOS) &&
            !valueInputAddres.match(PATTERN_ETH)
          }
          onClick={() => handleClick(valueInputAddres)}
        >
          Cyber
        </Button>
      </ActionBar>
    </div>
  );
};

export default GiftInfo;
