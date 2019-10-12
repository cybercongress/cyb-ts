import React from 'react';

const Num = n => (
  <p className="title-left-count" key={n}>
    {n}
  </p>
);

export const Nums = ({ amount }) => {
  const arr = [];
  for (let i = 1; i <= amount; i++) {
    arr.push(Num(i));
  }
  return <div className="block-left-container-site">{arr}</div>;
};
