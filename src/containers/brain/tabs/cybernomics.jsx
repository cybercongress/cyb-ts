import React from 'react';
import { Link } from 'react-router-dom';
import { CardStatisics, Dots, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';

function CybernomicsTab({ data }) {
  try {
    const { gol, cyb } = data;
    return (
      <>
        <LinkWindow to="https://etherscan.io/token/0xF4ecdBa8ba4144Ff3a2d8792Cad9051431Aa4F64">
          <CardStatisics
            title="GOL supply"
            value={gol.loading ? <Dots /> : formatNumber(gol.supply)}
            link
          />
        </LinkWindow>
        <LinkWindow to="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xF4ecdBa8ba4144Ff3a2d8792Cad9051431Aa4F64">
          <CardStatisics
            title="Uniswap price of GGOL in ETH"
            value={gol.loading ? <Dots /> : formatNumber(gol.price)}
            link
          />
        </LinkWindow>
        <CardStatisics
          title="Cap in ETH"
          value={gol.loading ? <Dots /> : formatNumber(gol.cap)}
        />

        <CardStatisics title="CYB supply" value={formatNumber(cyb.supply)} />
        <CardStatisics
          title="Port price of GCYB in ETH"
          value={formatNumber(Math.floor(cyb.price * 1000) / 1000)}
        />
        <CardStatisics title="Cap in ETH" value={formatNumber(cyb.cap)} />
      </>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default CybernomicsTab;
