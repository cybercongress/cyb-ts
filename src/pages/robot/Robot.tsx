import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import TxsTable from 'src/containers/account/component/txsTable';
import FeedsTab from 'src/containers/account/tabs/feeds';
import FollowsTab from 'src/containers/account/tabs/follows';
import Heroes from 'src/containers/account/tabs/heroes';
import ForceGraph from 'src/containers/forceGraph/forceGraph';
import TableDiscipline from 'src/containers/gol/table';
import IpfsSettings from 'src/containers/ipfsSettings';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import Sigma from 'src/containers/sigma';
import Taverna from 'src/containers/taverna';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { CONTRACT_ADDRESS_PASSPORT } from 'src/containers/portal/utils';
import { Citizenship } from 'src/types/citizenship';
import { routes } from 'src/routes';
import Layout from './Layout/Layout';
import RoutedEnergy from '../../containers/energy/index';
import UnderConstruction from './UnderConstruction/UnderConstruction';
// import Chat from './Chat/Chat';
// import Items from './Items/Items';
// import Skills from './Skills/Skills';
// import Karma from './Karma/Karma';
import Wallet from '../../containers/Wallet/Wallet';

const RobotContext = React.createContext<{
  address: string | null;
  passport: Citizenship | undefined;
  isOwner: boolean;
  addRefetch: (func: () => void) => void;
  refetchData: () => void;
}>({
  address: null,
  passport: undefined,
  isOwner: false,
  addRefetch: () => {},
  refetchData: () => {},
});

export const useRobotContext = () => React.useContext(RobotContext);

function IndexCheck() {
  // const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  return <Sigma />;
}

function Robot() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [passport, setPassport] = useState<Citizenship>();
  const [refetchFuncs, setRefetch] = useState<(() => void)[]>([]);

  const {
    pocket: { defaultAccount, accounts },
    passport: currentPassport,
  } = useSelector(({ pocket, passport }: RootState) => {
    return {
      pocket,
      passport: passport.data,
    };
  });

  const { username } = params;
  const nickname =
    username?.includes('@') && username.substring(1, username.length);

  let { address } = params;

  const robotUrl = location.pathname.includes(routes.robot.path);
  let isOwner: boolean | undefined = false;

  if (robotUrl) {
    address = defaultAccount.account?.cyber?.bech32 || currentPassport?.owner;
    isOwner = true;
  } else if (nickname && currentPassport?.extension.nickname === nickname) {
    address = currentPassport.owner;
  }

  const currentRobotAddress = address || passport?.owner || null;

  const checkIsOwner = useCallback(
    (address: string | null) => {
      if (!address) {
        return false;
      }

      const ownedAddresses: string[] = [];

      if (currentPassport) {
        const { owner, extension } = currentPassport;

        if (owner === address || extension.nickname === nickname) {
          return true;
        }
        extension.addresses?.forEach(({ address: addr }) => {
          if (addr === address) {
            ownedAddresses.push(addr);
          }
        });
      }

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
    [currentPassport, accounts, nickname]
  );

  if (!isOwner) {
    isOwner = checkIsOwner(currentRobotAddress);
  }

  useEffect(() => {
    if (robotUrl && currentPassport) {
      navigate(
        location.pathname.replace(
          routes.robot.path,
          routes.robotPassport.getLink(currentPassport.extension.nickname)
        ),
        {
          replace: true,
        }
      );
    }
  }, [robotUrl, currentPassport, navigate, location.pathname]);

  useEffect(() => {
    if (
      !queryClient ||
      isOwner ||
      // redirect from /robot to /@nickname
      (passport && passport.extension.nickname === nickname) ||
      (!address && !nickname)
    ) {
      return;
    }

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

    (async () => {
      try {
        const response = (await queryClient.queryContractSmart(
          CONTRACT_ADDRESS_PASSPORT,
          query
        )) as Citizenship;

        setPassport(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [
    nickname,
    address,
    queryClient,
    navigate,
    robotUrl,
    passport,
    isOwner,
    location.pathname,
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
      passport,
      isOwner,
      addRefetch,
      refetchData,
    }),
    [passport, addRefetch, refetchData, isOwner, currentRobotAddress]
  );

  // if (robotUrl && !address) {
  //   return <Navigate to={routes.portal.path} />;
  // }

  // useEffect(() => {
  //   if (robotUrl && !(address || passport || currentPassport.loading)) {
  //     navigate(routes.portal.path);
  //     // return <Navigate to={routes.portal.path} />;
  //   }
  // }, [passport, address, navigate, robotUrl, currentPassport.loading]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RobotContext.Provider value={contextValue}>
            <Layout />
          </RobotContext.Provider>
        }
      >
        <Route index element={<IndexCheck />} />
        <Route path="passport" element={<Wallet />} />
        <Route path="timeline" element={<TxsTable />} />
        <Route path="chat" element={<UnderConstruction />} />
        <Route path="badges" element={<TableDiscipline />} />
        <Route path="items" element={<UnderConstruction />} />
        <Route path="security" element={<Heroes />} />
        <Route path="skills" element={<UnderConstruction />} />
        <Route path="rights" element={<UnderConstruction />} />

        <Route path="sense" element={<Taverna />} />
        <Route
          path="drive"
          element={isOwner ? <IpfsSettings /> : <UnderConstruction />}
        />
        <Route path="log" element={<FeedsTab />} />
        <Route path="energy/*" element={<RoutedEnergy />} />
        <Route path="swarm" element={<FollowsTab />} />
        <Route path="brain" element={<ForceGraph />} />
        <Route path="karma" element={<UnderConstruction />} />
        <Route path="soul" element={<UnderConstruction />} />

        {/* <Route path="keys" element={<Keys />} /> */}

        <Route path="*" element={<p>Page should not exist</p>} />
      </Route>
    </Routes>
  );
}

export default Robot;
