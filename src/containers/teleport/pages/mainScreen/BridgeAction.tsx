import Display from 'src/components/containerGradient/Display/Display';
import TitleAction from './components/TitleAction/TitleAction';
import BridgeItem from './components/BridgeItem/BridgeItem';

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
  const renderItem = defaultData.map((item, index) => {
    return <BridgeItem key={index} item={item} />;
  });
  return (
    <Display
      title={
        <TitleAction
          title="bridge"
          subTitle="reliable transfer of tokens from net to net"
        />
      }
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {renderItem}
      </div>
    </Display>
  );
}

export default BridgeAction;
