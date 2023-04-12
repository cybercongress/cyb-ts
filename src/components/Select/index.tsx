/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useRef } from 'react';

import LinearGradientContainer from './LinearGradientContainer';
import styles from './Select.module.scss';
import { SelectContext, useSelectContext } from './selectContext';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { $TsFixMe, $TsFixMeFunc } from 'src/types/tsfix';

const classNames = require('classnames');

type OptionSelectProps = {
  text: React.ReactNode;
  value: string;
  img?: React.ReactNode;
  bgrImg?: boolean;
};

export function OptionSelect({ text, img, bgrImg, value }: OptionSelectProps) {
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

type SelectOption = {
  text: string;
  value: string;
};

type SelectProps = {
  valueSelect: $TsFixMe;
  onChangeSelect: $TsFixMeFunc;
  children: React.ReactNode;
  width?: string;
  disabled?: boolean;
  options?: SelectOption[];
  currentValue: React.ReactNode;
};

function Select({
  valueSelect,
  onChangeSelect,
  children,
  width,
  disabled,
  options,
  currentValue,
}: SelectProps) {
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
      // eslint-disable-next-line react/jsx-no-constructed-context-values
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
              <div className={styles.dropDownList}>
                {options
                  ? options.map((option) => {
                      const { value, text } = option;
                      return (
                        <OptionSelect key={value} text={text} value={value} />
                      );
                    })
                  : children}
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
    </SelectContext.Provider>
  );
}

export default Select;
