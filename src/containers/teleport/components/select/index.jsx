import React, { useContext, useEffect, useState } from 'react';
import { Dots, ValueImg } from '../../../../components';

const reduceTextCoin = (text) => {
  switch (text) {
    case 'mvolt':
      return 'V';

    case 'mamper':
      return 'A';

    case 'hydrogen':
      return 'H';

    case 'boot':
      return 'BOOT';

    default:
      return text;
  }
};

const Select = ({ data, selected, valueSelect, onChangeSelect }) => {
  let items = {};

  if (data === null) {
    items = <option value="">pick token</option>;
  } else {
    items = (
      <>
        <option value="">pick token</option>
        {Object.keys(data)
          .filter((item) => item.indexOf('pool') === -1 && item !== selected)
          .map((key) => (
            <option
              key={key}
              value={key}
              // style={{
              //   backgroundImage: `url(${tokenImg(key)})`,
              // }}
            >
              {reduceTextCoin(key)}
            </option>
          ))}
      </>
    );
  }

  return (
    <select
      style={{
        width: '120px',
      }}
      value={valueSelect}
      onChange={onChangeSelect}
    >
      {items}
    </select>
  );
};

export default Select;
