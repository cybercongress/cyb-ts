import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  MainContainer,
  ContainerGradientText,
  ActionBarSteps,
  BtnGrd,
} from '../portal/components';
import Input from '../teleport/components/input';
import { AppContext } from '../../context';

const ValueItem = ({ text, value, onChange }) => (
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

function DetailsNetwork() {
  const param = useParams();
  const history = useHistory();
  const { networks, updateNetworks } = useContext(AppContext);
  const [customConfig, setCustomConfig] = useState({});

  useEffect(() => {
    if (
      Object.keys(networks).length > 0 &&
      Object.prototype.hasOwnProperty.call(param, 'networkId')
    ) {
      const { networkId } = param;
      if (Object.prototype.hasOwnProperty.call(networks, networkId)) {
        setCustomConfig({ ...networks[networkId] });
      }
    }
  }, [networks, param]);

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

  const onClickUpdateNetwork = useCallback(() => {
    if (
      Object.keys(networks).length > 0 &&
      Object.prototype.hasOwnProperty.call(param, 'networkId')
    ) {
      const { networkId } = param;
      if (Object.prototype.hasOwnProperty.call(networks, networkId)) {
        const newList = { ...networks };
        delete newList[networkId];
        newList[customConfig.CHAIN_ID] = { ...customConfig };
        updateNetworks(newList);
        setTimeout(() => {
          history.push(`/network/${customConfig.CHAIN_ID}`);
          window.location.reload();
        }, 1000);
      }
    }
  }, [networks, customConfig, param, updateNetworks]);

  return (
    <>
      <MainContainer>
        <ContainerGradientText>
          {Object.keys(customConfig).length > 0 && (
            <div style={{ gap: '10px', display: 'grid' }}>
              <ValueItem
                text="chainId"
                value={customConfig.CHAIN_ID}
                onChange={(e) => onChangeValue(e, 'CHAIN_ID')}
              />
              <ValueItem
                text="prefix"
                value={customConfig.BECH32_PREFIX_ACC_ADDR_CYBER}
                onChange={(e) =>
                  onChangeValue(e, 'BECH32_PREFIX_ACC_ADDR_CYBER')
                }
              />
              <ValueItem
                text="denom"
                value={customConfig.DENOM_CYBER}
                onChange={(e) => onChangeValue(e, 'DENOM_CYBER')}
              />
              <ValueItem
                text="liquid denom"
                value={customConfig.DENOM_LIQUID_TOKEN}
                onChange={(e) => onChangeValue(e, 'DENOM_LIQUID_TOKEN')}
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
                text="index wss"
                value={customConfig.CYBER_INDEX_WEBSOCKET}
                onChange={(e) => onChangeValue(e, 'CYBER_INDEX_WEBSOCKET')}
              />
            </div>
          )}
        </ContainerGradientText>
      </MainContainer>
      <ActionBarSteps>
        <BtnGrd text="update network" onClick={() => onClickUpdateNetwork()} />
      </ActionBarSteps>
    </>
  );
}

export default DetailsNetwork;
