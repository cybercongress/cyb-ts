import KeybaseAvatar from 'src/containers/validator/keybaseAvatar';
import { ValidatorTableData } from 'src/containers/Validators/types/tableData';
import { Link } from 'react-router-dom';
import { routes } from 'src/routes';
import imgSearch from 'images/ionicons_svg_ios-help-circle-outline.svg';
import styles from './Moniker.module.scss';
import { StatusTooltip } from '../../../ui';

function Moniker({
  data,
  status,
  operatorAddress,
}: {
  data: ValidatorTableData['description'];
  status: ValidatorTableData['status'];
  operatorAddress: ValidatorTableData['operatorAddress'];
}) {
  const { moniker, identity } = data;
  return (
    <div className={styles.monikerContainer}>
      <StatusTooltip status={status} />
      <KeybaseAvatar identity={identity} />
      <Link
        to={routes.hero.getLink(operatorAddress)}
        className={styles.moniker}
      >
        {moniker}
      </Link>
      <Link
        style={{
          position: 'absolute',
          left: '100%',
        }}
        to={`/search/${moniker}`}
      >
        <img
          src={imgSearch}
          alt="img"
          style={{
            width: 15,
          }}
        />
      </Link>
    </div>
  );
}

export default Moniker;
