import { useParams } from 'react-router-dom';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { SubnetHyperParameters } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';

import styles from '../../Subnet.module.scss';

function SubnetHyperParams() {
  const { id: netuid } = useParams();

  const hyperparamsQuery = useCybernetContract<SubnetHyperParameters>({
    query: {
      get_subnet_hyperparams: {
        netuid: +netuid,
      },
    },
  });

  return (
    <Display title={<DisplayTitle title="Hyperparams" />}>
      <ul className={styles.list}>
        {hyperparamsQuery.data &&
          Object.keys(hyperparamsQuery.data).map((item) => {
            const value = hyperparamsQuery.data[item];
            let content = value;

            return (
              <li key={item}>
                {item}: <div>{content}</div>
              </li>
            );
          })}
      </ul>
    </Display>
  );
}

export default SubnetHyperParams;
