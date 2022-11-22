import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { MainContainer, ActionBarSteps, BtnGrd } from '../portal/components';
import useGetNetworks from '../../hooks/useGetNetworks';
import { AppContext } from '../../context';

const ValueItem = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
    {children}
  </div>
);

const initValue = {
  CHAIN_ID: 'bostrom',
  DENOM_CYBER: 'boot',
  DENOM_LIQUID_TOKEN: 'hydrogen',
  DENOM_CYBER_G: 'GBOOT',
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
  const history = useHistory();
  const { networks, updateNetworks } = useContext(AppContext);
  const [customConfig, setCustomConfig] = useState({ ...initValue });

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

      case 'DENOM_CYBER':
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
    if (networks !== null && Object.keys(networks).length > 0) {
      if (
        !Object.prototype.hasOwnProperty.call(networks, customConfig.CHAIN_ID)
      ) {
        updateNetworks(customConfig);
        setTimeout(() => {
          history.push('/network');
        }, 2000);
      }
    }
  }, [networks, customConfig, updateNetworks]);

  return (
    <>
      <MainContainer>
        <div style={{ gap: '5px', display: 'grid' }}>
          <ValueItem>
            <div>chainId</div>
            <input
              type="text"
              value={customConfig.CHAIN_ID}
              onChange={(e) => onChangeValue(e, 'CHAIN_ID')}
            />
          </ValueItem>
          <ValueItem>
            <div>prefix</div>
            <input
              type="text"
              value={customConfig.BECH32_PREFIX_ACC_ADDR_CYBER}
              onChange={(e) => onChangeValue(e, 'BECH32_PREFIX_ACC_ADDR_CYBER')}
            />
          </ValueItem>
          <ValueItem>
            <div>denom</div>
            <input
              type="text"
              value={customConfig.DENOM_CYBER}
              onChange={(e) => onChangeValue(e, 'DENOM_CYBER')}
            />
          </ValueItem>
          <ValueItem>
            <div>liquid denom</div>
            <input
              type="text"
              value={customConfig.DENOM_LIQUID_TOKEN}
              onChange={(e) => onChangeValue(e, 'DENOM_LIQUID_TOKEN')}
            />
          </ValueItem>
          <ValueItem>
            <div>rpc</div>
            <input
              type="text"
              value={customConfig.CYBER_NODE_URL_API}
              onChange={(e) => onChangeValue(e, 'CYBER_NODE_URL_API')}
            />
          </ValueItem>
          <ValueItem>
            <div>wss</div>
            <input
              type="text"
              value={customConfig.CYBER_WEBSOCKET_URL}
              onChange={(e) => onChangeValue(e, 'CYBER_WEBSOCKET_URL')}
            />
          </ValueItem>
          <ValueItem>
            <div>lcd</div>
            <input
              type="text"
              value={customConfig.CYBER_NODE_URL_LCD}
              onChange={(e) => onChangeValue(e, 'CYBER_NODE_URL_LCD')}
            />
          </ValueItem>
          <ValueItem>
            <div>index</div>
            <input
              type="text"
              value={customConfig.CYBER_INDEX_HTTPS}
              onChange={(e) => onChangeValue(e, 'CYBER_INDEX_HTTPS')}
            />
          </ValueItem>
          <ValueItem>
            <div>index wss</div>
            <input
              type="text"
              value={customConfig.CYBER_INDEX_WEBSOCKET}
              onChange={(e) => onChangeValue(e, 'CYBER_INDEX_WEBSOCKET')}
            />
          </ValueItem>
        </div>
      </MainContainer>
      <ActionBarSteps>
        <BtnGrd text="add network" onClick={() => onClickAddNetwork()} />
      </ActionBarSteps>
    </>
  );
}

export default CustomNetwork;
