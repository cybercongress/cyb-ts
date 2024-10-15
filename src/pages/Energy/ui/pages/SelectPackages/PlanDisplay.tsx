import styles from './Buy.module.scss';
import checkmark from './images/checkmark.svg';
import { features, plans } from '../../../types/type';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';
import AdviserHoverWrapper from 'src/features/adviser/AdviserHoverWrapper/AdviserHoverWrapper';
import { Display } from 'src/components';

interface PlanDisplayProps {
  plan: (typeof plans)[0];
  index: number;
  isSelected: boolean;
}

function PlanDisplay({ plan, index, isSelected }: PlanDisplayProps) {
  const renderPlanFeature = (featureIndex: number) => {
    const featureRenderers = {
      default: () => (
        <div
          className={
            plan.features[featureIndex] ? styles.checkmark : styles.excluded
          }
        >
          {plan.features[featureIndex] ? (
            <img src={checkmark} alt="checkmark" className={styles.checkmark} />
          ) : (
            '❌'
          )}
        </div>
      ),
      2: () =>
        plan.uploads > 0 ? (
          <div className={styles.uploads}>~ {plan.uploads}</div>
        ) : (
          <div className={styles.excluded}>❌</div>
        ),
      3: () => (
        <div className={styles.symbols}>
          <span className={styles.symbolsText}>
            {'>'}
            <span className={styles.symbolsDigit}>{plan.symbols}</span>
            {'symbols'}
          </span>
        </div>
      ),
      4: () =>
        plan.fuel > 0 ? (
          <div className={styles.fuel}>
            <IconsNumber value={plan.fuel} type="hydrogen" isVertical={false} />
          </div>
        ) : (
          <div className={styles.excluded}>❌</div>
        ),
      5: () =>
        plan.energy > 0 ? (
          <div className={styles.energy}>
            <span className={styles.energyIcon}>
              <IconsNumber
                value={plan.energy}
                type="energy"
                isVertical={false}
              />
            </span>
          </div>
        ) : (
          <div className={styles.excluded}>❌</div>
        ),
      6: () =>
        plan.influence > 0 ? (
          <div className={styles.influence}>
            {plan.influence} <span className={styles.gray}>‰</span>
          </div>
        ) : (
          <div className={styles.excluded}>❌</div>
        ),
    };

    const renderer =
      featureRenderers[featureIndex as keyof typeof featureRenderers] ||
      featureRenderers.default;
    return renderer();
  };

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
        noPaddingY
        noPaddingX
      >
        <AdviserHoverWrapper adviserContent={'test'}>
          <div className={styles.planContent}>
            {features.map((_, index) => (
              <div key={index} className={styles.row}>
                {renderPlanFeature(index)}
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
