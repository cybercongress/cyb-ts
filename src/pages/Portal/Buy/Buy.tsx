import { useState } from 'react';
import styles from './Buy.module.scss';
import portal from 'images/space-pussy.svg';
import oracle from 'src/image/new_icons/oracle.svg';
import docs from 'src/image/new_icons/docs.svg';
import sphere from 'src/image/new_icons/sphere.svg';
import hfr from 'src/image/new_icons/hfr.svg';
import teleport from 'src/image/new_icons/teleport.svg';
/* import studio from './images/studio.png'; */
import robot from 'src/image/new_icons/robot.svg';
import { MoonAnimation } from 'src/containers/portal/components';
import { features, plans } from './type';
import { Stars } from 'src/containers/portal/components';
import { ActionBar, Button } from 'src/components';
import PlanDisplay from './PlanDisplay';


function Buy() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  
  const renderFeatureContent = (feature: typeof features[0]) => {
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

  return (
    <>
      <Stars />
      <MoonAnimation />
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
        {plans.map((plan, index) => (
          <PlanDisplay
            key={plan.name}
            plan={plan}
            index={index}
            isSelected={selectedPlan === plan.name}
            isHovered={hoveredPlan === plan.name}
            onSelect={() => setSelectedPlan(plan.name)}
            onHover={() => setHoveredPlan(plan.name)}
            onLeave={() => setHoveredPlan(null)}
          />

        ))}
      </div>
      {selectedPlan && (
        <ActionBar>
          <Button onClick={() => console.log(`Selected plan: ${selectedPlan}`)} className={styles.actionBarBtn}>
            Buy {selectedPlan} Plan
          </Button>
        </ActionBar>
      )}
    </>
  );
};

export default Buy;
