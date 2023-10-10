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
  selectAccountsPassports,
  selectCommunityPassports,
} from 'src/features/passport/passports.redux';
import { useAppSelector } from 'src/redux/hooks';
import { useQueryClient } from 'src/contexts/queryClient';
import { getPassportByNickname } from 'src/containers/portal/utils';
import { useSearchParams } from 'react-router-dom';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
import useDebounce from '../../hooks/useDebounce';
import styles from './styles.module.scss';
import { contains } from './utils';
import AccountInputOptionList from './AccountInputItem';
import AccountInputListContainer from './AccountInputContainer';
import { TypeRecipient } from './type';
import ButtonText from './ButtonText';
import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';

type Props = {
  recipient: string | undefined;
  setRecipient: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const PLACEHOLDER_TITLE = 'choose recipient';

const configRecipient = {
  [TypeRecipient.friends]: {
    label: '🫂',
  },
  [TypeRecipient.my]: {
    label: '🔑',
  },
  [TypeRecipient.following]: {
    label: '👀',
  },
};

function AccountInput({ recipient, setRecipient }: Props) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const inputElem = useRef(null);
  const selectContainerRef = useRef(null);
  const { debounce } = useDebounce();
  const firstEffectOccured = useRef(false);

  const [isOpen, setIsOpen] = useState(true);
  const [selectedTypeRecipient, setSelectedTypeRecipient] = useState(
    TypeRecipient.friends
  );
  const [valueRecipient, setValueRecipient] = useState<string>('');
  const [listRecipient, setListRecipient] = useState<SliceState>({});

  const selectCommunity = useAppSelector(selectCommunityPassports);
  const { accounts } = useAppSelector(selectAccountsPassports);

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

  const selectedDataRecipient = useMemo(() => {
    if (selectedTypeRecipient === TypeRecipient.my) {
      return accounts;
    }

    if (selectedTypeRecipient === TypeRecipient.following) {
      return selectCommunity.following;
    }

    return selectCommunity.friends;
  }, [selectedTypeRecipient, accounts, selectCommunity]);

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
      if (Object.keys(selectedDataRecipient).length > 0) {
        const result = contains(value, selectedDataRecipient);
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
    [selectedDataRecipient, queryClient]
  );

  const handleSearch = useCallback(
    debounce((inputVal: string) => getRecipient(inputVal), 500),
    [getRecipient]
  );

  const onChangeRecipient = useCallback(
    (inputVal: string) => {
      if (!inputVal.length) {
        setListRecipient(selectedDataRecipient);
      }
      setValueRecipient(inputVal);
      handleSearch(inputElem.current?.value);
    },
    [selectedDataRecipient]
  );

  const useListRecipient = useMemo(() => {
    if (!valueRecipient.length || !Object.keys(listRecipient).length) {
      return selectedDataRecipient;
    }
    return listRecipient;
  }, [listRecipient, valueRecipient, selectedDataRecipient]);

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

      {isOpen && (
        <AccountInputListContainer>
          <div className={styles.containerButtonText}>
            <ButtonsGroup
              type="radio"
              items={Object.values(TypeRecipient).map((recipType) => {
                return {
                  label: configRecipient[recipType].label,
                  name: recipType,
                  checked: selectedTypeRecipient === recipType,
                  // tooltip: recipType,
                };
              })}
              onChange={(val: TypeRecipient) => setSelectedTypeRecipient(val)}
            />
          </div>

          {useListRecipient && Object.keys(useListRecipient).length > 0 && (
            <AccountInputOptionList
              data={useListRecipient}
              onClickByNickname={onClickByNickname}
            />
          )}
        </AccountInputListContainer>
      )}
    </div>
  );
}

AccountInput.displayName = 'AccountInput';

export default AccountInput;
