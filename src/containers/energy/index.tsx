import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { MyEnergy, Income, Outcome } from './tab';
import { Statistics, ActionBar } from './component';
import useGetSlots from '../mint/useGetSlots';
import useGetSourceRoutes from './hooks/useSourceRouted';
import { convertResources } from '../../utils/utils';
import { ContainerGradientText } from 'src/components';
import { RootState } from 'src/redux/store';
import { useRobotContext } from 'src/pages/robot/robot.context';

function RoutedEnergy() {
  const location = useLocation();
  const [selected, setSelected] = useState('myEnegy');
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const { address } = useRobotContext();
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);

  const isOwner =
    defaultAccount && defaultAccount.account?.cyber.bech32 === address;

  const {
    slotsData,
    loadingAuthAccounts,
    balacesResource,
    update: updateSlots,
  } = useGetSlots(address);
  const {
    sourceRouted,
    sourceEnergy,
    destinationRoutes,
    destinationEnergy,
    update: updateSource,
  } = useGetSourceRoutes(address);

  const selectedRoute =
    selectedIndex !== null && sourceRouted[Number(selectedIndex)];

  useEffect(() => {
    const { pathname } = location;
    if (pathname.match(/income/gm) && pathname.match(/income/gm).length > 0) {
      setSelected('income');
    } else if (
      pathname.match(/outcome/gm) &&
      pathname.match(/outcome/gm).length > 0
    ) {
      setSelected('outcome');
    } else {
      setSelected('myEnegy');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  let content;

  if (selected === 'myEnegy') {
    content = (
      <MyEnergy
        slotsData={slotsData}
        balacesResource={balacesResource}
        loadingAuthAccounts={loadingAuthAccounts}
      />
    );
  }

  if (selected === 'income') {
    content = <Income destinationRoutes={destinationRoutes} />;
  }

  if (selected === 'outcome') {
    content = (
      <Outcome
        sourceRouted={sourceRouted}
        selectRouteFunc={isOwner ? setSelectedIndex : undefined}
      />
    );
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          rowGap: '20px',
        }}
      >
        <ContainerGradientText>
          <Statistics
            active={selected}
            myEnegy={balacesResource.milliampere * balacesResource.millivolt}
            outcome={
              convertResources(sourceEnergy.milliampere) *
              convertResources(sourceEnergy.millivolt)
            }
            income={
              convertResources(destinationEnergy.milliampere) *
              convertResources(destinationEnergy.millivolt)
            }
          />
        </ContainerGradientText>

        <ContainerGradientText
          userStyleContent={{
            padding: '15px 0',
          }}
        >
          {content}
        </ContainerGradientText>
      </div>

      <div
        style={{
          position: 'fixed',
          left: 0,
        }}
      >
        {isOwner && (
          <ActionBar
            selected={selected}
            addressActive={address}
            selectedRoute={selectedRoute}
            updateFnc={() => {
              setSelectedIndex(null);
              updateSlots();
              updateSource();
            }}
          />
        )}
      </div>
    </>
  );
}

export default RoutedEnergy;
