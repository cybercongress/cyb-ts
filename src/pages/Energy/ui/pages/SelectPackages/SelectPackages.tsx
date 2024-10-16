import { useCallback, useMemo, useState } from 'react';
import portal from 'images/space-pussy.svg';
import oracle from 'src/image/new_icons/oracle.svg';
import docs from 'src/image/new_icons/docs.svg';
import sphere from 'src/image/new_icons/sphere.svg';
import hfr from 'src/image/new_icons/hfr.svg';
import teleport from 'src/image/new_icons/teleport.svg';
import robot from 'src/image/new_icons/robot.svg';

import { ActionBar, Button } from 'src/components';

import { useAppDispatch } from 'src/redux/hooks';
import { setSelectPlan } from 'src/pages/Energy/redux/energy.redux';
import { EnergyPackageSwapRoutes } from 'src/pages/Energy/types/EnergyPackages';
import styles from './Buy.module.scss';
import { features, plans } from 'src/pages/Energy/types/type';
import PlanDisplay from './PlanDisplay';
import { useEnergy } from 'src/pages/Energy/context/Energy.context';
import { assetsBuy, symbol } from 'src/pages/Energy/utils/tokenBuy';
import { newShiftedMinus } from 'src/pages/Energy/utils/utils';
import BigNumber from 'bignumber.js';
import mapPlan from './utils';

const renderFeatureContent = (feature: (typeof features)[0]) => {
  if (feature.label === '3 free to use aips') {
    return (
      <div className={styles.icons}>
        <img src={portal} alt="portal" width="20" height="20" />
        <img src={oracle} alt="oracle" width="20" height="20" />
        <img src={docs} alt="docs" width="20" height="20" />
      </div>
    );
  }
  if (feature.label === 'all powered aips') {
    return (
      <div className={styles.icons}>
        <img src={sphere} alt="sphere" width="20" height="20" />
        <img src={hfr} alt="hfr" width="20" height="20" />
        <img src={teleport} alt="teleport" width="20" height="20" />
        <img src={robot} alt="robot" width="20" height="20" />
      </div>
    );
  }
  return null;
};

function SelectPackages() {
  const { energyPackageSwapRoutes } = useEnergy();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const onClickSelectPlan = useCallback(() => {
    console.log('selectedPlan', selectedPlan);
    console.log('energyPackageSwapRoutes', energyPackageSwapRoutes);
    if (!energyPackageSwapRoutes) {
      return;
    }

    const selectedPlanFind = energyPackageSwapRoutes.find(
      (item) => item.keyPackage === selectedPlan
    );

    if (!selectedPlanFind) {
      return;
    }

    dispatch(
      setSelectPlan({
        keyPackage: selectedPlanFind.keyPackage,
        tokenIn: selectedPlanFind.tokenIn,
      })
    );
  }, [dispatch, selectedPlan, energyPackageSwapRoutes]);

  const renderPlans = useMemo(() => {
    return plans.map((plan, index) => {
      if (energyPackageSwapRoutes) {
        const findItem = energyPackageSwapRoutes.find(
          (item) => item.keyPackage === plan.price
        );

        const { fuel, energy, uploads, symbols } = mapPlan(findItem);

        plan.fuel = fuel.toNumber();
        plan.energy = energy.toNumber();
        plan.uploads = uploads.toNumber();
        plan.symbols = symbols;
      }
      return (
        <button
          type="button"
          key={plan.name}
          onClick={() => setSelectedPlan(plan.price)}
          className={styles.planWrapper}
        >
          <PlanDisplay
            plan={plan}
            index={index}
            isSelected={selectedPlan === plan.price}
          />
        </button>
      );
    });
  }, [energyPackageSwapRoutes, selectedPlan]);

  return (
    <>
      <div className={styles.buyContainer}>
        <div className={styles.labelsColumn}>
          <div className={styles.planContent}>
            {features.map((feature, index) => (
              <div key={index} className={styles.row}>
                <div className={styles.labelGroup}>
                  <div className={styles.label}>{feature.label}</div>
                  {feature.subLabel && (
                    <div className={styles.subLabel}>{feature.subLabel}</div>
                  )}
                  {renderFeatureContent(feature)}
                </div>
              </div>
            ))}
          </div>
        </div>
        {renderPlans}
      </div>

      {selectedPlan && (
        <ActionBar>
          <Button
            onClick={() => onClickSelectPlan()}
            className={styles.actionBarBtn}
            disabled={selectedPlan === 'free'}
          >
            Buy {plans.find((item) => item.price === selectedPlan)?.name} Plan
          </Button>
        </ActionBar>
      )}
    </>
  );
}

export default SelectPackages;
