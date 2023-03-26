/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef } from 'react';

import LinearGradientContainer from './LinearGradientContainer';
import styles from './styles.scss';
import { SelectContext, useSelectContext } from './selectContext';
import useOnClickOutside from '../../hooks/useOnClickOutside';

const classNames = require('classnames');

export function OptionSelect({ text, img, bgrImg, value, ...props }) {
  const { changeSelectedOption } = useSelectContext();
  return (
    <div
      className={styles.listItem}
      onClick={() => changeSelectedOption(value)}
    >
      <div
        className={styles.bgrImg}
        style={bgrImg ? { boxShadow: 'none', background: 'transparent' } : {}}
      >
        {img || ''}
      </div>
      <div>{text}</div>
    </div>
  );
}

function Select({
  valueSelect,
  onChangeSelect,
  children,
  width,
  disabled,
  currentValue,
}) {
  const selectContainerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => {
    if (!disabled) {
      setIsOpen((item) => !item);
    }
  };

  const clickOutsideHandler = () => setIsOpen(false);

  const updateSelectedOption = (option) => {
    onChangeSelect(option);
    setIsOpen(false);
  };

  useOnClickOutside(selectContainerRef, clickOutsideHandler);

  return (
    <SelectContext.Provider
      value={{
        selectedOption: valueSelect,
        changeSelectedOption: updateSelectedOption,
      }}
    >
      <div
        style={{ width: width || '120px' }}
        className={styles.dropDown}
        ref={selectContainerRef}
      >
        <div className={styles.dropDownContainer}>
          <button
            type="button"
            onClick={toggling}
            className={styles.dropDownContainerHeader}
          >
            <div className={styles.dropDownHeader}>{currentValue}</div>
            <LinearGradientContainer />
          </button>
          {isOpen && (
            <div className={styles.dropDownListContainer}>
              <div className={styles.dropDownList}>{children}</div>

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
    </SelectContext.Provider>
  );
}

export default Select;
