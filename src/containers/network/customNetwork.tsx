import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNetworks } from 'src/contexts/networks';
import { ActionBarSteps } from '../portal/components';
import {
  Input,
  BtnGrd,
  ContainerGradientText,
  MainContainer,
} from '../../components';
import { useAdviser } from 'src/features/adviser/context';

function ValueItem({ text, value, onChange }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        alignItems: 'center',
      }}
    >
      <div>{text}</div>
      <Input type="text" autoComplete="off" value={value} onChange={onChange} />
    </div>
  );
}

const initValue = {
  CHAIN_ID: 'bostrom',
  BASE_DENOM: 'boot',
  DENOM_LIQUID: 'hydrogen',
  CYBER_NODE_URL_API: 'https://rpc.bostrom.cybernode.ai',
  CYBER_WEBSOCKET_URL: 'wss://rpc.bostrom.cybernode.ai/websocket',
  CYBER_NODE_URL_LCD: 'https://lcd.bostrom.cybernode.ai',
  CYBER_INDEX_HTTPS: 'https://index.bostrom.cybernode.ai/v1/graphql',
  CYBER_INDEX_WEBSOCKET: 'wss://index.bostrom.cybernode.ai/v1/graphql',
  BECH32_PREFIX_ACC_ADDR_CYBER: 'bostrom',
  BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: 'bostromvaloper',
  MEMO_KEPLR: '[bostrom] cyb.ai, using keplr',
};

function CustomNetwork() {
  const navigate = useNavigate();
  const { networks, updateNetworks } = useNetworks();
  const [customConfig, setCustomConfig] = useState({ ...initValue });

  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser('run your public network inside bostrom ');
  }, [setAdviser]);

  const onChangeValue = (e, key) => {
    const { value } = e.target;
    switch (key) {
      case 'CHAIN_ID':
        setCustomConfig((item) => ({
          ...item,
          [key]: value,
          MEMO_KEPLR: `[${value}]cyb.ai, using keplr`,
        }));
        break;
      case 'BECH32_PREFIX_ACC_ADDR_CYBER':
        setCustomConfig((item) => ({
          ...item,
          [key]: value,
          BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: `${value}valoper`,
        }));
        break;

      case 'BASE_DENOM':
        setCustomConfig((item) => ({
          ...item,
          [key]: value,
          DENOM_CYBER_G: `G${value.toUpperCase()}`,
        }));
        break;

      default:
        setCustomConfig((item) => ({ ...item, [key]: value }));
        break;
    }
  };

  const onClickAddNetwork = useCallback(() => {
    if (networks && Object.keys(networks).length > 0) {
      if (
        !Object.prototype.hasOwnProperty.call(networks, customConfig.CHAIN_ID)
      ) {
        const newList = { ...networks };
        newList[customConfig.CHAIN_ID] = { ...customConfig };
        updateNetworks(newList);
        setTimeout(() => {
          navigate('/network');
        }, 2000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networks, customConfig, updateNetworks]);

  return (
    <>
      <MainContainer>
        <ContainerGradientText>
          <div style={{ gap: '10px', display: 'grid' }}>
            <ValueItem
              text="chainId"
              value={customConfig.CHAIN_ID}
              onChange={(e) => onChangeValue(e, 'CHAIN_ID')}
            />
            <ValueItem
              text="prefix"
              value={customConfig.BECH32_PREFIX_ACC_ADDR_CYBER}
              onChange={(e) => onChangeValue(e, 'BECH32_PREFIX_ACC_ADDR_CYBER')}
            />
            <ValueItem
              text="denom"
              value={customConfig.BASE_DENOM}
              onChange={(e) => onChangeValue(e, 'BASE_DENOM')}
            />
            <ValueItem
              text="iquid denom"
              value={customConfig.DENOM_LIQUID}
              onChange={(e) => onChangeValue(e, 'DENOM_LIQUID')}
            />
            <ValueItem
              text="rpc"
              value={customConfig.CYBER_NODE_URL_API}
              onChange={(e) => onChangeValue(e, 'CYBER_NODE_URL_API')}
            />
            <ValueItem
              text="wss"
              value={customConfig.CYBER_WEBSOCKET_URL}
              onChange={(e) => onChangeValue(e, 'CYBER_WEBSOCKET_URL')}
            />
            <ValueItem
              text="lcd"
              value={customConfig.CYBER_NODE_URL_LCD}
              onChange={(e) => onChangeValue(e, 'CYBER_NODE_URL_LCD')}
            />
            <ValueItem
              text="index"
              value={customConfig.CYBER_INDEX_HTTPS}
              onChange={(e) => onChangeValue(e, 'CYBER_INDEX_HTTPS')}
            />
            <ValueItem
              text="ndex wss"
              value={customConfig.CYBER_INDEX_WEBSOCKET}
              onChange={(e) => onChangeValue(e, 'CYBER_INDEX_WEBSOCKET')}
            />
          </div>
        </ContainerGradientText>
      </MainContainer>
      <ActionBarSteps>
        <BtnGrd text="add network" onClick={() => onClickAddNetwork()} />
      </ActionBarSteps>
    </>
  );
}

export default CustomNetwork;
