import BigNumber from 'bignumber.js';
import React, { useContext } from 'react';
import { AppContext } from '../../../../../context';
import { convertAmount } from '../../../../../utils/utils';
import RowItem from './RowItem';
import styles from './styles.scss';

// const testData = {
//   liquid: '1 102 102 102 102',
//   frozen: 102,
//   melting: 102,
//   growth: 102,
//   total: 100231,
// };

function DetailsBalance({ data }) {
  return (
    <div className={styles.containerDetailsBalance}>
      {Object.keys(data)
        .filter(
          (valueKey) =>
            valueKey !== 'total' && valueKey !== 'cap' && valueKey !== 'price'
        )
        .map((key) => {
          return (
            <RowItem key={key} value={data[key]} text={key} cap={data.cap} />
          );
        })}
    </div>
  );
}

export default DetailsBalance;
