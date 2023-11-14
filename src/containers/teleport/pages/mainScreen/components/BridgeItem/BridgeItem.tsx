import { Link } from 'react-router-dom';
import { DenomArr } from 'src/components';
import fromToIbc from 'images/fromToIbc.svg';
import styles from './styles.module.scss';

type PropsBridgeItem = {
  item: {
    networkFrom: string;
    networkTo: string;
    token: string;
  };
};

function BridgeItem({ item }: PropsBridgeItem) {
  const searchParam = `networkFrom=${item.networkFrom}&networkTo=${item.networkTo}&token=${item.token}`;

  return (
    <Link to={`bridge?${searchParam}`} className={styles.containerBridgeItem}>
      <DenomArr denomValue={item.token} onlyImg size={45} />
      <div className={styles.networks}>
        <DenomArr type="network" onlyImg denomValue={item.networkFrom} />
        <img src={fromToIbc} alt="fromToIbc" className={styles.networksArrow} />

        <DenomArr type="network" onlyImg denomValue={item.networkTo} />
      </div>
    </Link>
  );
}

export default BridgeItem;
