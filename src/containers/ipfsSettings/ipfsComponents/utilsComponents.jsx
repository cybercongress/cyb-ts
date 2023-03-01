import React from 'react';
import { OptionSelect } from '../../teleport/components/select';

function ContainerKeyValue({ children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr',
        gap: '20px',
        alignItems: 'center',
        minHeight: '42px',
      }}
    >
      {children}
    </div>
  );
}

const renderOptions = (data, selected, valueSelect) => {
  let items = {};
  if (data !== null) {
    items = (
      <>
        {data
          .filter((item) => item !== selected)
          .map((itemValue) => (
            <OptionSelect key={itemValue} value={itemValue} text={itemValue} />
          ))}
      </>
    );
  }

  return items;
};

const updsteIpfsStateType = (newTypeValue) => {
  const lsTypeIpfs = localStorage.getItem('ipfsState');
  if (lsTypeIpfs !== null) {
    const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
    const newObj = { ...lsTypeIpfsData, ipfsNodeType: newTypeValue };
    localStorage.setItem('ipfsState', JSON.stringify(newObj));
  }
};

const updsteIpfsStateUrl = (newUrlValue) => {
  const lsTypeIpfs = localStorage.getItem('ipfsState');
  if (lsTypeIpfs !== null) {
    const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
    const newObj = { ...lsTypeIpfsData, urlOpts: newUrlValue };
    localStorage.setItem('ipfsState', JSON.stringify(newObj));
  }
};

export {
  updsteIpfsStateUrl,
  updsteIpfsStateType,
  renderOptions,
  ContainerKeyValue,
};
