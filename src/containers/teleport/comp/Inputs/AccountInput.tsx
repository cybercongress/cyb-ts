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
import {
  SliceState,
  selectCommunityPassports,
} from 'src/features/passport/passports.redux';
import { useAppSelector } from 'src/redux/hooks';
import { useQueryClient } from 'src/contexts/queryClient';
import { getPassportByNickname } from 'src/containers/portal/utils';
import { useSearchParams } from 'react-router-dom';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
import useDebounce from '../../useDebounce';
import styles from './styles.module.scss';
import { contains } from './utils';
import AccountInputOptionList from './AccountInputItem';

type Props = {
  recipient: string | undefined;
  setRecipient: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const PLACEHOLDER_TITLE = 'choose recipient';

function AccountInput({ recipient, setRecipient }: Props) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const inputElem = useRef(null);
  const selectContainerRef = useRef(null);

  const firstEffectOccured = useRef(false);
  const [isOpen, setIsOpen] = useState(true);
  const [valueRecipient, setValueRecipient] = useState<string>('');
  const { debounce } = useDebounce();
  const selectCommunity = useAppSelector(selectCommunityPassports);
  const { accounts } = useAppSelector((state) => state.pocket);
  console.log('accounts', accounts)

  const [listRecipient, setListRecipient] = useState<SliceState>({});

  const clickOutsideHandler = () => setIsOpen(false);

  useOnClickOutside(selectContainerRef, clickOutsideHandler);

  useEffect(() => {
    if (recipient && recipient.length && recipient.match(PATTERN_CYBER)) {
      clickOutsideHandler();
    }
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

      let listRecipientTemp: SliceState = {};
      if (Object.keys(selectCommunity.friends).length > 0) {
        const result = contains(value, selectCommunity.friends);
        if (Object.keys(result).length) {
          listRecipientTemp = { ...result };
        }
      }

      const resultHandle = await await getPassportByNickname(
        queryClient,
        value
      );

      if (resultHandle) {
        const resultHandleRecipient = {
          [resultHandle.owner]: { loading: false, data: resultHandle },
        };

        listRecipientTemp = { ...resultHandleRecipient, ...listRecipientTemp };
      }

      setListRecipient(listRecipientTemp);
    },
    [selectCommunity.friends, queryClient]
  );

  const handleSearch = useCallback(
    debounce((inputVal: string) => getRecipient(inputVal), 500),
    [getRecipient]
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

  const onClickByNickname = (owner: string, nickname: string | undefined) => {
    setValueRecipient(nickname || owner);
    setRecipient(owner);
    clickOutsideHandler();
  };

  if (!isOpen && recipient) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={styles.containerBtnValue}
      >
        <LinearGradientContainer color={Color.Green} title={PLACEHOLDER_TITLE}>
          <Account
            avatar
            disabled
            address={recipient}
            styleUser={{ height: '42px' }}
          />
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
        title={PLACEHOLDER_TITLE}
        color={!recipient ? Color.Red : Color.Green}
        classNameTextbox={styles.contentValueInput}
        onFocusFnc={() => setIsOpen(true)}
        autoFocus
        // onClick={}
      />

      {isOpen &&
        useListRecipient &&
        Object.keys(useListRecipient).length > 0 && (
          <AccountInputOptionList
            data={useListRecipient}
            onClickByNickname={onClickByNickname}
          />
        )}
    </div>
  );
}

AccountInput.displayName = 'AccountInput';

export default AccountInput;
