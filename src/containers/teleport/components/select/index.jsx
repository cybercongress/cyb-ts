/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  Children,
} from 'react';
import { Denom, ValueImg } from '../../../../components';
import { LinearGradientContainer } from '../input';
import styles from './styles.scss';
import { reduceTextCoin } from '../../utils';
import { SelectContext, useSelectContext } from './selectContext';

const classNames = require('classnames');

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      const el = ref?.current;
      if (!el || el.contains(event?.target || null)) {
        return;
      }

      handler(event); // Call the handler only if the click is outside of the element passed.
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export const OptionSelect = ({ text, img, value, ...props }) => {
  const { changeSelectedOption } = useSelectContext();
  return (
    <div
      className={styles.listItem}
      onClick={() => changeSelectedOption(value)}
    >
      <div className={styles.bgrImg}>{img || ''}</div>
      <div>{text}</div>
    </div>
  );
};

const Select = ({
  valueSelect,
  textSelectValue,
  imgSelectValue,
  onChangeSelect,
  children,
}) => {
  const selectContainerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => setIsOpen(!isOpen);

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
      <div className={styles.dropDown} ref={selectContainerRef}>
        <div className={styles.dropDownContainer}>
          <div onClick={toggling} className={styles.dropDownContainerHeader}>
            <div className={styles.dropDownHeader}>
              {valueSelect === '' ? (
                <OptionSelect
                  text="choose"
                  img={
                    <Denom
                      justifyContent="center"
                      denomValue="choose"
                      onlyImg
                    />
                  }
                  value=""
                />
              ) : (
                <OptionSelect
                  text={<Denom denomValue={textSelectValue} onlyText />}
                  img={
                    imgSelectValue || (
                      <Denom
                        justifyContent="center"
                        denomValue={textSelectValue}
                        onlyImg
                      />
                    )
                  }
                  value={valueSelect}
                />
              )}
            </div>
            <LinearGradientContainer />
          </div>
          {isOpen && (
            <div className={styles.dropDownListContainer}>
              <div className={styles.dropDownList}>
                {Object.keys(children).length > 0 ? children : ''}
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
};

export default Select;
