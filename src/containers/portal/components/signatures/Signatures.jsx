import React from 'react';
import styles from './styles.scss';

const bostrom = 'bostrom1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjwxgd445';

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

const Signatures = () => {
  const sliceBostrom = bostrom.slice(9, bostrom.length - 2);
  console.log('sliceBostrom', sliceBostrom);
  const hexBostrom = Buffer.from(sliceBostrom).toString('hex');

  let inx = 0;
  const items = [];
  while (inx <= hexBostrom.length - 2) {
    items.push(hexBostrom.substr(inx, 3));
    inx += 3;
  }

  return (
    <div>
      <div>Signatures</div>
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {bostrom.slice(0, 9)}
        {items.map((code, i) => (
          <div
            key={i}
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
        ))}
        {bostrom.slice(bostrom.length - 2)}
      </div>
    </div>
  );
};

export default Signatures;
