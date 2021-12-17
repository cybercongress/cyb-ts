import React from 'react';

function InitializationInfo({ initTxHash, details }) {
  return (
    <div>
      <div>Instantiation transaction: {initTxHash} </div>
      <div>Creator: {details.creator ? details.creator : '-'}</div>
      <div>Admin: {details.admin ? details.admin : '-'}</div>
    </div>
  );
}

export default InitializationInfo;
