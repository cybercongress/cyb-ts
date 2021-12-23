import React from 'react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import styles from './styles.scss';

function JsonView({ src, strLength }) {
  return (
    <ReactJson
      src={src}
      name={false}
      displayDataTypes={false}
      displayObjectSize={false}
      collapseStringsAfterLength={strLength ?? 24}
      theme="twilight"
    />
  );
}

const jsonInputStyle = {
  container: { display: 'flex', flexDirection: 'column' },
  body: { order: '1' },
  warningBox: { order: '2' },
};

const FlexWrapCantainer = ({ children }) => (
  <div className={styles.containerFlexWrapCantainer}>{children}</div>
);

const CardCantainer = ({ children }) => (
  <div className={styles.containerCardCantainer}>{children}</div>
);

const LinkTx = ({ children, txs }) => (
  <Link to={`/network/bostrom/tx/${txs}`}>{children}</Link>
);

const LinkCreator = ({ children, address }) => (
  <Link to={`/network/bostrom/contract/${address}`}>{children}</Link>
);

export {
  jsonInputStyle,
  JsonView,
  FlexWrapCantainer,
  CardCantainer,
  LinkTx,
  LinkCreator,
};
