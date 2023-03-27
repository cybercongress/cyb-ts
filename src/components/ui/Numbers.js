import React from 'react';

function Num(n) {
  return (
    <p className="title-left-count" key={n}>
      {n}
    </p>
  );
}

export function Nums({ amount }) {
  const arr = [];
  for (let i = 1; i <= amount; i++) {
    arr.push(Num(i));
  }
  return <div className="block-left-container-site">{arr}</div>;
}
