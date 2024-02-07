import Display from 'src/components/containerGradient/Display/Display';
import { useChannels } from 'src/hooks/useHub';
import { useMemo } from 'react';
import TitleAction from '../TitleAction/TitleAction';
import BridgeItem from './BridgeItem';
import styles from './BridgeAction.module.scss';
import TotalCount from '../TotalCount/TotalCount';

const defaultData = [
  {
    token:
      'ibc/15E9C5CF5969080539DB395FA7D9C0868265217EFC528433671AAF9B1912D159',
    networkFrom: 'cosmoshub-4',
    networkTo: 'bostrom',
  },
  {
    token:
      'ibc/B6CAD3F7469F3FAD18ED2230A6C7B15E654AB2E1B66E1C70879C04FEF874A863',
    networkFrom: 'gravity-bridge-3',
    networkTo: 'bostrom',
  },
];

function BridgeAction() {
  const { channels } = useChannels();

  const totalCount = useMemo(() => {
    if (channels) {
      return Object.keys(channels).length - defaultData.length;
    }
    return 0;
  }, [channels]);

  const renderItem = defaultData.map((item, index) => {
    return <BridgeItem key={index} item={item} />;
  });

  return (
    <Display
      title={
        <TitleAction
          to="bridge"
          title="bridge"
          subTitle="reliable transfer of tokens from net to net"
        />
      }
    >
      <div className={styles.container}>
        {renderItem}
        {totalCount > 0 && (
          <TotalCount text="networks" value={totalCount} to="bridge" />
        )}
      </div>
    </Display>
  );
}

export default BridgeAction;
