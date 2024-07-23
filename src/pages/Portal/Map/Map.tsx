import { MainContainer } from 'src/components';
import { Stars } from 'src/containers/portal/components';
import Map from './Map';
import styles from './Map.module.scss';

function Map() {
  return (
    <MainContainer>
      <Stars />
      <img className={styles.mapImg} src="/images/cyb-map.png" alt="map" />
    </MainContainer>
  );
}

export default Map;
