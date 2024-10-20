import styles from './Buy.module.scss';
import { features, plans } from '../../../types/type';
import AdviserHoverWrapper from 'src/features/adviser/AdviserHoverWrapper/AdviserHoverWrapper';
import { Display } from 'src/components';
import { renderPlanFeature } from './planFeatureMapper';

interface PlanDisplayProps {
  plan: (typeof plans)[0];
  index: number;
  isSelected: boolean;
}

function PlanDisplay({ plan, index, isSelected }: PlanDisplayProps) {
  return (
    <div
      className={`${styles.displayWrapper} ${isSelected ? styles.active : ''} ${
        styles[plan.color]
      }`}
      style={{ left: `${-2 * (index + 1)}px` }}
    >
      <Display
        color={plan.color}
        title={
          <div className={styles.planTitleWrapper}>
            <img
              src={plan.icon}
              alt={`${plan.name} icon`}
              className={styles.planIcon}
            />
            <span
              className={`${styles.planName} ${
                plan.name === 'ghost' ? styles.gray : styles[plan.color]
              }`}
            >
              {plan.name}
            </span>
          </div>
        }
        noPadding
      >
        <AdviserHoverWrapper adviserContent={'test'}>
          <div className={styles.planContent}>
            {features.map((_, featureIndex) => (
              <div key={featureIndex} className={styles.row}>
                {renderPlanFeature(plan, featureIndex)}
              </div>
            ))}
            <div className={styles.row}>
              <div
                className={`${styles.price} ${
                  plan.price === 'free' ? styles.gray : styles[plan.color]
                }`}
              >
                {plan.price}
                {plan.price === 'free' ? '' : '$'}
              </div>
            </div>
          </div>
        </AdviserHoverWrapper>
      </Display>
    </div>
  );
}

export default PlanDisplay;
