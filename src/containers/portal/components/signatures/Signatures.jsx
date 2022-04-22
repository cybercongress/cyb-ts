import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles.scss';

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

const getHeight = (value) => {
  try {
    if (isNumeric(value)) {
      if (value / 10 > 20) {
        return Math.ceil((value / 10) * 0.18);
      }
      return Math.ceil(value / 10);
    }
    return 2;
  } catch (e) {
    console.log('e', e);
    return 2;
  }
};

const Signatures = ({ addressActive }) => {
  const hexBostrom = useMemo(() => {
    if (addressActive !== null) {
      const { bech32 } = addressActive;
      const sliceBostrom = bech32.slice(9, bech32.length - 2);
      return Buffer.from(sliceBostrom).toString('hex');
    }
    return null;
  }, [addressActive]);

  const address = useMemo(() => {
    if (addressActive !== null) {
      const { bech32 } = addressActive;
      return bech32;
    }
    return null;
  }, [addressActive]);

  let inx = 0;
  const items = [];
  if (hexBostrom !== null) {
    while (inx <= hexBostrom.length - 2) {
      items.push(hexBostrom.substr(inx, 3));
      inx += 3;
    }
  }

  return (
    <div>
      {/* <div>Signatures</div> */}
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {address !== null && address.slice(0, 9)}
        {items.map((code, i) => {
          const key = uuidv4();

          return (
            <div
              key={key}
              className={styles.hashPart}
              style={{
                background: `#${code}`,
                color: `#${code}`,
                width: '8px',
                maxHeight: '20px',
                height: `${getHeight(code)}px`,
                borderRadius: '2px',
              }}
            />
          );
        })}
        {address !== null && address.slice(address.length - 2)}
      </div>
    </div>
  );
};

export default Signatures;
