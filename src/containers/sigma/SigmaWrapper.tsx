import React from 'react';
import Sigma from '.';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

function SigmaWrapper() {
  const { accounts } = useSelector((state: RootState) => state.pocket);
  return (
    <div
      style={{
        margin: '0 auto',
        width: '72%',
        paddingBottom: '200px',
      }}
    >
      {/* <Sigma /> */}

      <div
        style={{
          display: 'grid',
          gridGap: '20px',
        }}
      >
        {accounts &&
          Object.keys(accounts).map((item) => {
            return (
              <Sigma
                address={
                  accounts[item]?.cyber?.bech32 ||
                  accounts[item]?.cosmos?.bech32
                }
              />
            );
          })}
      </div>
    </div>
  );
}

export default SigmaWrapper;
