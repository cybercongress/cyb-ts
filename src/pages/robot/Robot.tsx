import {
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
import Layout from './Layout/Layout';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import RoutedEnergy from '../../containers/energy/index';
import Sigma from 'src/containers/sigma';
import Taverna from 'src/containers/taverna';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { CONTRACT_ADDRESS_PASSPORT } from 'src/containers/portal/utils';
import { Citizenship } from 'src/types/citizenship';
import React from 'react';
import { routes } from 'src/routes';
import UnderConstruction from './UnderConstruction/UnderConstruction';
// import Chat from './Chat/Chat';
// import Items from './Items/Items';
// import Skills from './Skills/Skills';
// import Karma from './Karma/Karma';

const RobotContext = React.createContext<{
  passport: Citizenship | null;
  address: undefined | string;
  refetchData: () => void;
  addRefetch: (func: () => void) => void;
  isOwner: boolean;
}>({
  passport: null,
  address: null,
  isOwner: false,
});

export const useRobotContext = () => React.useContext(RobotContext);

function IndexCheck() {
  // const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  // const address = defaultAccount.account?.cyber?.bech32;

  return <Sigma />;
}

function Robot() {
  const params = useParams();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const robotUrl = location.pathname.includes('/robot');

  const { username } = params;
  const nickname =
    username?.includes('@') && username.substring(1, username.length);

  const {
    pocket: { defaultAccount, accounts },
    passport: currentPassport,
  } = useSelector(({ pocket, passport }: RootState) => {
    return {
      pocket,
      passport,
    };
  });

  const [passport, setPassport] = useState<Citizenship | null>(
    currentPassport.data &&
      (currentPassport.data.extension.nickname === nickname || robotUrl)
      ? currentPassport.data
      : null
  );

  let { address } = params;

  if (robotUrl) {
    address = defaultAccount.account?.cyber?.bech32;
  }

  const [refetchFuncs, setRefetch] = useState([]);

  useEffect(() => {
    if (robotUrl && passport) {
      navigate(
        location.pathname.replace(
          '/robot',
          routes.robotPassport.getLink(passport.extension.nickname)
        ),
        {
          replace: true,
        }
      );
    }
  }, [robotUrl, passport, navigate, location.pathname]);

  useEffect(() => {
    if (
      !queryClient ||
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
    location.pathname,
  ]);

  const handleAddRefetch = useCallback(
    (func: () => void) => {
      setRefetch((items) => [...items, func]);
    },
    [setRefetch]
  );

  // useEffect(() => {
  //   if (robotUrl && !(address || passport || currentPassport.loading)) {
  //     navigate(routes.portal.path);
  //     // return <Navigate to={routes.portal.path} />;
  //   }
  // }, [passport, address, navigate, robotUrl, currentPassport.loading]);

  const currentRobotAddress = address || passport?.owner || null;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RobotContext.Provider
            value={useMemo(
              () => ({
                passport,
                address: currentRobotAddress,
                refetchData: () => {
                  refetchFuncs.map((func) => func());
                },
                addRefetch: handleAddRefetch,
                isOwner: ((address) => {
                  // maybe better to refactor this to find user addresses first and then check by .includes()
                  let isOwner = false;

                  if (!address) {
                    return false;
                  }

                  if (currentPassport.data) {
                    if (currentPassport.data.owner === address) {
                      isOwner = true;
                    } else if (
                      currentPassport.data.extension.nickname === nickname
                    ) {
                      isOwner = true;
                    } else if (
                      currentPassport.data.extension.addresses.find(
                        (add) => add.address === address
                      )
                    ) {
                      isOwner = true;
                    }
                  }

                  if (
                    accounts &&
                    Object.keys(accounts).find((acc) => {
                      const { cyber } = accounts[acc];

                      // only bostrom for now
                      if (!cyber) {
                        return false;
                      }

                      const { bech32, keys } = cyber;

                      return bech32 === address && keys !== 'read-only';
                    })
                  ) {
                    isOwner = true;
                  }

                  return isOwner;
                })(currentRobotAddress),
              }),
              [
                passport,
                handleAddRefetch,
                refetchFuncs,
                currentPassport.data,
                nickname,
                accounts,
                currentRobotAddress,
              ]
            )}
          >
            <Layout />
          </RobotContext.Provider>
        }
      >
        <Route index element={<IndexCheck />} />
        {/* <Route path="passport" element={<Navigate to="../" />} /> */}
        <Route path="timeline" element={<TxsTable />} />
        <Route path="chat" element={<UnderConstruction />} />
        <Route path="badges" element={<TableDiscipline />} />
        <Route path="items" element={<UnderConstruction />} />
        <Route path="security" element={<Heroes />} />
        <Route path="skills" element={<UnderConstruction />} />
        <Route path="rights" element={<UnderConstruction />} />

        {/* <Route path="sigma" element={<Sigma />} /> */}
        <Route path="sense" element={<Taverna />} />
        <Route path="drive" element={<IpfsSettings />} />
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
