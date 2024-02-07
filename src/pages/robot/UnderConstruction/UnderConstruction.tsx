import { ActionBar } from 'src/components';
import cx from 'classnames';
import Display from 'src/components/containerGradient/Display/Display';
import styles from './UnderConstruction.module.scss';
import layoutStyles from '../Layout/Layout.module.scss';

function UnderConstruction() {
  return (
    <Display>
      <div className={cx(layoutStyles.container, styles.wrapper)}>
        <img
          src={require('./under-construction.png')}
          alt="Under construction"
        />

        <h5>
          the page is <br /> under construction
        </h5>
      </div>

      <ActionBar
        button={{
          text: 'Back',
          onClick: () => window.history.back(),
        }}
      />
    </Display>
  );
}

export default UnderConstruction;
