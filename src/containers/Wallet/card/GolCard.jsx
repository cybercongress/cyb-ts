import React from 'react';
import { Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { PocketCard } from '../components';
import { LinkWindow } from '../../../components';

function GolCard({ pocket, ...props }) {
  return (
    <PocketCard {...props}>
      <Text fontSize="16px" color="#fff">
        Welcome to the intergalactic tournament - Game of Links. GoL - is the
        main preparation before{' '}
        <Link to="/search/genesis">the main network launch</Link> of{' '}
        <LinkWindow to="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ">
          the cyber protocol
        </LinkWindow>
        . Main goal of the tournament is to collectively bootstrap{' '}
        <Link to="/brain">Superintelligence</Link>. Everyone can find themselves
        in this fascinating process: we need to setup physical infrastructure,
        upload initial knowledge, and create a reserve for sustaining the
        project during infancy. Athletes must solve different parts of the
        puzzle and could win up to 10% of CYB in the Genesis.{' '}
        <Link to="/gol">Go and play</Link>.
      </Text>
    </PocketCard>
  );
}

export default GolCard;
