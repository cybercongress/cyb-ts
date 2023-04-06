import { Pane } from '@cybercongress/gravity';
import Select from './select';
import { DenomArr, OptionSelect } from '../../../components';


type NetworkList = {
  [key: string]: string;
};

const renderNetwork = (data: NetworkList) => {
  return Object.keys(data).map((key) => (
    <OptionSelect
      key={key}
      value={key}
      text={
        <DenomArr
          type="network"
          denomValue={data[key]}
          onlyText
          tooltipStatusText={false}
        />
      }
      img={
        <DenomArr
          type="network"
          denomValue={data[key]}
          onlyImg
          tooltipStatusImg={false}
        />
      }
    />
  ));
};

type NetworkSetterProps = {
  selectedNetwork: string;
  onChangeSelectNetwork: (item: string) => void;
  networks: NetworkList;
  textLeft?: string;
};

function NetworkSetter({
  selectedNetwork,
  onChangeSelectNetwork,
  networks,
  textLeft,
}: NetworkSetterProps) {
  return (
    <Pane width="inherit">
      <Pane
        display="grid"
        gridTemplateColumns="40px 1fr"
        gridGap="27px"
        alignItems="flex-start"
        marginBottom={20}
      >
        <Pane width="33px" fontSize="20px" paddingBottom={10}>
          {textLeft}
        </Pane>
        <Pane width="100%" display="flex" flexDirection="column" gap="20px">
          <Select
            type="network"
            width="100%"
            valueSelect={selectedNetwork}
            textSelectValue={selectedNetwork || ''}
            onChangeSelect={(item) => onChangeSelectNetwork(item)}
          >
            {networks && renderNetwork(networks)}
          </Select>
        </Pane>
      </Pane>
    </Pane>
  );
}

export default NetworkSetter;
