import Iframe from 'src/components/Iframe/Iframe';
import styles from './styles.scss';

function GatewayContentItem({ url }: { url: string }) {
  return (
    <div className={styles.gatewayCantainer}>
      <Iframe url={url} />
    </div>
  );
}

export default GatewayContentItem;
