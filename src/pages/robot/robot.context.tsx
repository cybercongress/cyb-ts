import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import usePassportContract from 'src/features/passport/usePassportContract';
import { RootState } from 'src/redux/store';
import { routes } from 'src/routes';
import { Citizenship } from 'src/types/citizenship';

const RobotContext = React.createContext<{
  address: string | null;
  passport: Citizenship | undefined | null;
  isOwner: boolean;
  nickname: string | undefined;
  isLoading: boolean;
  addRefetch: (func: () => void) => void;
  refetchData: () => void;
}>({
  address: null,
  passport: undefined,
  isOwner: false,
  isLoading: false,
  nickname: undefined,
  addRefetch: () => {},
  refetchData: () => {},
});

export const useRobotContext = () => React.useContext(RobotContext);

function RobotContextProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [refetchFuncs, setRefetch] = useState<(() => void)[]>([]);

  const {
    pocket: { defaultAccount, accounts },
    passport: currentUserPassport,
  } = useSelector(({ pocket, passports }: RootState) => {
    const address = pocket.defaultAccount.account?.cyber?.bech32;

    return {
      pocket,
      // maybe try to reuse passport hook
      passport: (address && passports[address]) || {
        data: undefined,
        loading: false,
      },
    };
  });

  const { username } = params;
  const nickname =
    username?.includes('@') && username.substring(1, username.length);

  let { address } = params;

  const robotUrl = location.pathname.includes(routes.robot.path);
  let isOwner: boolean | undefined = false;

  if (robotUrl) {
    address =
      defaultAccount.account?.cyber?.bech32 || currentUserPassport.data?.owner;
    isOwner = true;
  } else if (
    nickname &&
    currentUserPassport.data?.extension.nickname === nickname
  ) {
    address = currentUserPassport.data.owner;
  }

  const checkIsOwner = useCallback(
    (address: string | undefined) => {
      if (!address) {
        return false;
      }

      const ownedAddresses: string[] = [];

      // if (currentUserPassport.data) {
      //   const { owner, extension } = currentUserPassport.data;

      //   if (owner === address || extension.nickname === nickname) {
      //     return true;
      //   }
      //   extension.addresses?.forEach(({ address: addr }) => {
      //     if (addr === address) {
      //       ownedAddresses.push(addr);
      //     }
      //   });
      // }

      if (accounts) {
        Object.keys(accounts).forEach((account) => {
          const { cyber } = accounts[account];

          // only bostrom for now
          if (!cyber) {
            return false;
          }

          const { bech32, keys } = cyber;

          if (bech32 === address && keys !== 'read-only') {
            ownedAddresses.push(bech32);
          }
        });
      }

      if (ownedAddresses.includes(address)) {
        return true;
      }

      return false;
    },
    [accounts]
  );

  if (!isOwner) {
    isOwner = checkIsOwner(address);
  }
  isOwner = isOwner as boolean;

  let query = {};
  if (address) {
    query = {
      active_passport: {
        address,
      },
    };
  } else if (nickname) {
    query = {
      passport_by_nickname: {
        nickname,
      },
    };
  }

  const passportContract = usePassportContract<Citizenship>({
    query,
    skip: isOwner,
  });

  const currentPassport = isOwner ? currentUserPassport : passportContract;
  const currentRobotAddress = address || currentPassport.data?.owner || null;
  const isLoading = currentPassport.loading;

  // redirect from /robot to /@nickname
  const newUser =
    !passportContract.loading &&
    !currentUserPassport.loading &&
    !currentRobotAddress;

  // redirects
  useEffect(() => {
    if (
      newUser &&
      location.pathname.includes(routes.robot.path) &&
      // allowed routes
      ![
        routes.robot.path,
        routes.robot.routes.drive.path,
        routes.robot.routes.sense.path,
      ].includes(location.pathname)
    ) {
      navigate(routes.robot.path);
    }

    if (
      robotUrl &&
      currentUserPassport.data &&
      defaultAccount.account?.cyber.bech32 === currentUserPassport.data.owner
    ) {
      navigate(
        location.pathname.replace(
          routes.robot.path,
          routes.robotPassport.getLink(
            currentUserPassport.data.extension.nickname
          )
        ),
        {
          replace: true,
        }
      );
    }
  }, [
    location.pathname,
    robotUrl,
    currentUserPassport.data,
    newUser,
    defaultAccount,
    navigate,
  ]);

  const addRefetch = useCallback(
    (func: () => void) => {
      setRefetch((items) => [...items, func]);
    },
    [setRefetch]
  );

  const refetchData = useCallback(() => {
    refetchFuncs.forEach((func) => func());
  }, [refetchFuncs]);

  const contextValue = useMemo(
    () => ({
      address: currentRobotAddress,
      passport: currentPassport.data,
      isOwner,
      addRefetch,
      nickname: nickname || currentPassport.data?.extension.nickname,
      refetchData,
      isLoading,
    }),
    [
      currentPassport.data,
      nickname,
      addRefetch,
      refetchData,
      isOwner,
      isLoading,
      currentRobotAddress,
    ]
  );
  return (
    <RobotContext.Provider value={contextValue}>
      {children}
    </RobotContext.Provider>
  );
}

export default RobotContextProvider;
