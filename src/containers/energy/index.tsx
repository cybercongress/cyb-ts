import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRobotContext } from 'src/pages/robot/robot.context';
import Display from 'src/components/containerGradient/Display/Display';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAdviser } from 'src/features/adviser/context';
import { MyEnergy, Income, Outcome } from './tab';
import useGetSlots from '../mint/useGetSlots';
import { Statistics, ActionBar } from './component';
import useGetSourceRoutes from './hooks/useSourceRouted';
import { convertResources } from '../../utils/utils';

function RoutedEnergy() {
  const { pageId } = useParams();
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const { address } = useRobotContext();

  const currentAddress = useAppSelector(selectCurrentAddress);

  const isOwner = currentAddress === address;

  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <>
        place to manage energy wisely. investmint and route <br />
        both volts and amperes allow to create cyberlinks
      </>
    );
  }, [setAdviser]);

  const {
    slotsData,
    loadingAuthAccounts,
    balancesResource,
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

  let content;

  if (!pageId) {
    content = (
      <MyEnergy
        slotsData={slotsData}
        balancesResource={balancesResource}
        loadingAuthAccounts={loadingAuthAccounts}
      />
    );
  }

  if (pageId === 'income') {
    content = <Income destinationRoutes={destinationRoutes} />;
  }

  if (pageId === 'outcome') {
    content = (
      <Outcome
        sourceRouted={sourceRouted}
        selectRouteFunc={isOwner ? setSelectedIndex : undefined}
      />
    );
  }

  return (
    <>
      <Display color="blue">
        <Statistics
          active={pageId}
          myEnergy={balancesResource.milliampere * balancesResource.millivolt}
          outcome={
            convertResources(sourceEnergy.milliampere) *
            convertResources(sourceEnergy.millivolt)
          }
          income={
            convertResources(destinationEnergy.milliampere) *
            convertResources(destinationEnergy.millivolt)
          }
        />

        {content}
      </Display>

      <div
        style={{
          position: 'fixed',
          left: 0,
        }}
      >
        {isOwner && (
          <ActionBar
            selected={pageId}
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
