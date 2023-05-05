/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useRef } from 'react';

import { $TsFixMe, $TsFixMeFunc } from 'src/types/tsfix';
import styles from './Select.module.scss';
import { SelectContext, useSelectContext } from './selectContext';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import LinearGradientContainer, {
  Color,
} from '../LinearGradientContainer/LinearGradientContainer';

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
      {(bgrImg || img) && (
        <div
          className={styles.bgrImg}
          style={bgrImg ? { boxShadow: 'none', background: 'transparent' } : {}}
        >
          {img}
        </div>
      )}
      <div>{text || '-'}</div>
    </div>
  );
}

type SelectOption = {
  text: string;
  value: string;
  img?: React.ReactNode;
};

type SelectProps = {
  valueSelect: $TsFixMe;
  onChangeSelect: $TsFixMeFunc;
  children: React.ReactNode;
  width?: string;
  disabled?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  currentValue: React.ReactNode;
  color?: Color;
};

function Select({
  valueSelect,
  onChangeSelect,
  children,
  width,
  disabled,
  options,
  currentValue,
  placeholder,
  color = Color.Yellow,
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

  function renderTitle() {
    let value = currentValue;

    if (valueSelect && options) {
      const item = options.find((item) => item.value === valueSelect);

      if (item) {
        value = (
          <>
            {item.img} {item.text}
          </>
        );
      }
    }

    return value;
  }

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
            <LinearGradientContainer active={isOpen} color={color}>
              <span className={styles.dropDownHeader}>{renderTitle()}</span>
            </LinearGradientContainer>
          </button>
          {isOpen && (
            <div className={styles.dropDownListContainer}>
              <div className={styles.dropDownList}>
                {/* {placeholder && (
                  <OptionSelect text={placeholder} value={null} />
                )} */}
                {options
                  ? options.map((option) => {
                      const { value, text, img } = option;
                      return (
                        <OptionSelect
                          key={value}
                          text={text}
                          value={value}
                          img={img}
                        />
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
