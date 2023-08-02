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
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import { useSearchParams } from 'react-router-dom';
import useOnClickOutside from 'src/hooks/useOnClickOutside';

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
  const [searchParams] = useSearchParams();
  const inputElem = useRef(null);
  const selectContainerRef = useRef(null);
  const firstEffectOccured = useRef(false);
  const queryClient = useQueryClient();
  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [valueRecipient, setValueRecipient] = useState<string>('');
  const { debounce } = useDebounce();
  const selectCommunity = useAppSelector(selectCommunityPassports);
  const [listRecipient, setListRecipient] = useState<SliceState>({});

  const clickOutsideHandler = () => setIsOpen(false);

  useOnClickOutside(selectContainerRef, clickOutsideHandler);

  const onBlurInput = useCallback(() => {
    if (recipient && recipient.length && recipient.match(PATTERN_CYBER)) {
      setFocused(true);
    }
  }, [recipient]);

  useEffect(() => {
    onBlurInput();
  }, [recipient]);

  useEffect(() => {
    if (!firstEffectOccured.current) {
      firstEffectOccured.current = true;
      const param = Object.fromEntries(searchParams.entries());
      if (Object.keys(param).length > 0) {
        const { recipient: recipientParam } = param;
        if (recipientParam) {
          setValueRecipient(recipientParam);
          handleSearch(recipientParam);
        }
      }
    }
  }, [searchParams]);

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

  const onClickByNickname = (owner: string, nickname: string) => {
    console.log('nickname', nickname);
    console.log('owner', owner);
    setValueRecipient(nickname);
    setRecipient(owner);
    clickOutsideHandler();
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
    <div className={styles.containerListAndInput} ref={selectContainerRef}>
      <Input
        ref={inputElem}
        id="recipient"
        value={valueRecipient}
        onChange={(e) => onChangeRecipient(e.target.value)}
        title="choose recipient"
        color={Color.Green}
        classNameTextbox={styles.contentValueInput}
        onFocusFnc={() => setIsOpen(true)}
        autoFocus
        // onClick={}
      />

      {isOpen &&
        useListRecipient &&
        Object.keys(useListRecipient).length > 0 && (
          <div className={styles.containerList}>
            {Object.keys(useListRecipient).map((key) => {
              let nickname = key;
              let cidAvatar;
              let owner = key;
              const item = useListRecipient[key];
              if (item?.data) {
                const { data } = item;
                const { extension } = data;

                nickname = extension.nickname;
                owner = data.owner;
                cidAvatar = extension.avatar;
              }
              return (
                <button
                  type="button"
                  key={nickname}
                  onClick={() => onClickByNickname(owner, nickname)}
                  style={{ color: '#fff', display: 'flex' }}
                >
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                    }}
                  >
                    <AvataImgIpfs addressCyber={owner} cidAvatar={cidAvatar} />
                  </div>
                  <div>{nickname}</div>
                </button>
              );
            })}
          </div>
        )}
    </div>
  );
}

AccountInput.displayName = 'AccountInput';

export default AccountInput;
