/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import { Dots, ValueImg } from '../../../../components';
import { LinearGradientContainer } from '../input';
import styles from './styles.scss';
import { reduceTextCoin } from '../../utils';

const classNames = require('classnames');

// const Select = ({ data, selected, valueSelect, onChangeSelect, children }) => {
//   return (
//     <select
//       style={{
//         width: '120px',
//       }}
//       value={valueSelect}
//       onChange={onChangeSelect}
//     >
//       {children}
//     </select>
//   );
// };

const Select = ({ data, selected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const toggling = () => setIsOpen((value) => !value);

  return (
    <div className={styles.dropDown} onClick={toggling}>
      <div className={styles.dropDownContainer}>
        <div className={styles.dropDownContainerHeader}>
          <div className={styles.dropDownHeader}>choose</div>
          <LinearGradientContainer />
        </div>
        {isOpen && (
          <div className={styles.dropDownListContainer}>
            <div className={styles.dropDownList}>
              {Object.keys(data)
                .filter(
                  (item) => item.indexOf('pool') === -1 && item !== selected
                )
                .map((key) => (
                  <div key={key} className={styles.listItem}>
                    <ValueImg text={key} onlyImg /> {reduceTextCoin(key)}
                  </div>
                ))}
            </div>
            <div
              className={classNames(
                styles.ListContainer,
                styles.dropDownBottomLine
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
