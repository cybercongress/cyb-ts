import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';

const GiftInfo = () => {
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
        <Text lineHeight="23px" marginBottom={20} color="#fff" fontSize="18px">
          The Gods understand that with the support of the most advanced communities
          they have a better chance to bootstrap smarter superintelligence. So{' '}
          <a
            target="_blank"
            href="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ"
          >
            they decided to allocate 10% of CYB
          </a>{' '}
          in Genesis to the following communities:
          <ul style={{ listStyle: 'none' }}>
            <li>— 8% to Ethereum community</li>
            <li>— 1% to Cosmos community</li>
            <li>— 1% to Urbit community</li>
          </ul>
        </Text>
        <Text lineHeight="23px" marginBottom={20} color="#fff" fontSize="18px">
          But they are aware that the Genesis is quite far from now. Everyone is busy with
          the <Link to="/gol">Game of Links</Link> - the tournament which defines
          the fate of another 10% of CYB in the Genesis. You can find the Game
          of Links rules{' '}
          <a target="_blank" href="https://cybercongress.ai/game-of-links/">
            on the cyber~Congress site
          </a>
          .
        </Text>
        <Text lineHeight="23px" marginBottom={20} color="#fff" fontSize="18px">
          Game of Links is an incentivized test network which has its standalone
          tokens: EUL. Rumor has it that an incredible amount of tokens are allocated
          to Ethereans, Cosmonauts and Urbiters: 42.9% of EULs. So, go and claim
          them: simply <Link to="/pocket">put your ledger</Link> into the pocket.
        </Text>
        <Text lineHeight="23px" color="#fff" fontSize="18px">
          You can also import your private key (for Ethereum) or seed phrase
          (for Cosmos) to cyberdcli. While importing your keys be very
          careful. Adversaries are everywhere! We recommend using an external
          signers such as a Ledger device, before all of cybers software will pass 
          security audits.
        </Text>
      </Pane>
    </main>
  );
};

export default GiftInfo;
