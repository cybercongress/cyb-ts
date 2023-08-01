import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Account, Input } from 'src/components';
import LinearGradientContainer, {
  Color,
} from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { PATTERN_CYBER } from 'src/utils/config';
import styles from './styles.module.scss';
import {
  SliceState,
  selectCommunityPassports,
} from 'src/features/passport/passports.redux';
import useDebounce from '../../useDebounce';
import { useAppSelector } from 'src/redux/hooks';
import { useQueryClient } from 'src/contexts/queryClient';
import { getPassportByNickname } from 'src/containers/portal/utils';
import { Citizenship } from 'src/types/citizenship';
import { Nullable } from 'src/types';

function contains(query: string, list: SliceState) {
  return Object.values(list).filter((item) => {
    if (item?.data?.extension) {
      const { nickname } = item.data.extension;
      return nickname.toLowerCase().startsWith(query.toLowerCase());
    }
    return false;
  });
}

type Props = {
  recipient: string | undefined;
  setRecipient: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function AccountInput({ recipient, setRecipient }: Props) {
  const inputElem = useRef(null);
  const firstEffectOccured = useRef(false);
  const queryClient = useQueryClient();
  const [focused, setFocused] = useState(false);
  const [focusedList, setFocusedList] = useState(false);
  const [valueRecipient, setValueRecipient] = useState<string>('');
  const { debounce } = useDebounce();
  const selectCommunity = useAppSelector(selectCommunityPassports);
  const [listRecipient, setListRecipient] = useState<SliceState>({});

  console.log('valueRecipient', valueRecipient)

  useEffect(() => {
    console.log('recipient', recipient)
    console.log('firstEffectOccured.current', firstEffectOccured.current)
    if (!firstEffectOccured.current) {
      firstEffectOccured.current = true;
      if (recipient) {
        console.log('recipient', recipient)
        // setValueRecipient(recipient);
      }
    }

    onBlurInput();
  }, [recipient]);

  const onBlurInput = useCallback(() => {
    // setFocusedList(false);
    if (recipient && recipient.length && recipient.match(PATTERN_CYBER)) {
      setFocused(true);
    }
  }, [recipient]);

  const handleGetRecipient = useCallback(
    async (value: string) => {
      const response = await getPassportByNickname(queryClient, value);

      if (response) {
        return response.owner;
      }

      return undefined;
    },
    [queryClient]
  );

  const getRecipient = useCallback(
    async (value: string) => {
      if (!value) {
        setRecipient(undefined);
        return;
      }

      if (value.match(PATTERN_CYBER)) {
        setRecipient(value);
        return;
      }

      if (Object.keys(selectCommunity.friends).length > 0) {
        const result = contains(value, selectCommunity.friends);

        if (result.length > 0) {
          if (
            result.length === 1 &&
            result[0]?.data?.extension.nickname === value
          ) {
            setRecipient(result[0]?.data?.owner);
          }
          setListRecipient(result);
        }

        return;
      }

      const resultHandle = await handleGetRecipient(value);
      setRecipient(resultHandle);
    },
    [selectCommunity]
  );

  const handleSearch = useCallback(
    debounce((inputVal: string) => getRecipient(inputVal), 500),
    []
  );

  const onChangeRecipient = useCallback(
    (inputVal: string) => {
      if (!inputVal.length) {
        setListRecipient(selectCommunity.friends);
      }
      setValueRecipient(inputVal);
      handleSearch(inputElem.current?.value);
    },
    [selectCommunity.friends]
  );

  const useListRecipient = useMemo(() => {
    if (!valueRecipient.length || !Object.keys(listRecipient).length) {
      return selectCommunity.friends;
    }
    return listRecipient;
  }, [listRecipient, valueRecipient, selectCommunity.friends]);

  const onClickByNickname = (item: Nullable<Citizenship>) => {
    if (item) {
      setValueRecipient(item.extension.nickname);
      setRecipient(item.owner);
    }
  };

  if (focused && recipient) {
    return (
      <button
        type="button"
        onClick={() => setFocused(false)}
        className={styles.containerBtnValue}
      >
        <LinearGradientContainer color={Color.Green} title="choose recipient">
          <Account avatar address={recipient} />
        </LinearGradientContainer>
      </button>
    );
  }

  return (
    <>
      <Input
        ref={inputElem}
        id="recipient"
        value={valueRecipient}
        onChange={(e) => onChangeRecipient(e.target.value)}
        title="choose recipient"
        color={Color.Green}
        classNameTextbox={styles.contentValueInput}
        onBlurFnc={() => onBlurInput()}
        // onFocusFnc={() => setFocusedList(true)}
        // onClick={}
      />
      <div>
        {useListRecipient &&
          Object.values(useListRecipient).map((item) => {
            if (item?.data) {
              const { nickname } = item.data.extension;
              return (
                <button
                  type="button"
                  key={nickname}
                  onClick={() => onClickByNickname(item.data)}
                  style={{ color: '#fff', display: 'flex' }}
                >
                  {nickname}
                </button>
              );
            }
            return null;
          })}
      </div>
    </>
  );
}

AccountInput.displayName = 'AccountInput';

export default AccountInput;
