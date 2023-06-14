import { ContainerGradientText, ActionBar } from 'src/components';
import styles from './UnderConstruction.module.scss';

function UnderConstruction() {
  return (
    <ContainerGradientText
      userStyleContent={{
        minHeight: 550,
      }}
    >
      <div className={styles.wrapper}>
        <img src={require('./image.png')} alt="" />

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
    </ContainerGradientText>
  );
}

export default UnderConstruction;
