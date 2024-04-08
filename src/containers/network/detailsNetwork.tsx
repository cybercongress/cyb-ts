import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNetworks } from 'src/contexts/networks';
import { MainContainer, ActionBarSteps } from '../portal/components';
import { Input, BtnGrd, ContainerGradientText } from '../../components';
import { NetworkConfig } from 'src/types/networks';

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

function DetailsNetwork() {
  const param = useParams<{ networkId: string | undefined }>();
  const navigate = useNavigate();
  const { networks, updateNetworks } = useNetworks();
  const [customConfig, setCustomConfig] = useState<NetworkConfig>({});

  useEffect(() => {
    const { networkId } = param;

    if (networks && networkId) {
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
      case 'BECH32_PREFIX':
        setCustomConfig((item) => ({
          ...item,
          [key]: value,
          BECH32_PREFIX_VALOPER: `${value}valoper`,
        }));
        break;

      case 'BASE_DENOM':
        setCustomConfig((item) => ({
          ...item,
          [key]: value,
          DENOM_G: `G${value.toUpperCase()}`,
        }));
        break;

      default:
        setCustomConfig((item) => ({ ...item, [key]: value }));
        break;
    }
  };

  const onClickUpdateNetwork = useCallback(() => {
    const { networkId } = param;

    if (networks && networkId) {
      if (Object.prototype.hasOwnProperty.call(networks, networkId)) {
        const newList = { ...networks };
        delete newList[networkId];
        newList[customConfig.CHAIN_ID] = { ...customConfig };
        updateNetworks(newList);
        setTimeout(() => {
          navigate(`/network/${customConfig.CHAIN_ID}`);
          window.location.reload();
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                value={customConfig.BECH32_PREFIX}
                onChange={(e) => onChangeValue(e, 'BECH32_PREFIX')}
              />
              <ValueItem
                text="denom"
                value={customConfig.BASE_DENOM}
                onChange={(e) => onChangeValue(e, 'BASE_DENOM')}
              />
              <ValueItem
                text="liquid denom"
                value={customConfig.DENOM_LIQUID}
                onChange={(e) => onChangeValue(e, 'DENOM_LIQUID')}
              />
              <ValueItem
                text="rpc"
                value={customConfig.RPC_URL}
                onChange={(e) => onChangeValue(e, 'RPC_URL')}
              />
              <ValueItem
                text="wss"
                value={customConfig.WEBSOCKET_URL}
                onChange={(e) => onChangeValue(e, 'WEBSOCKET_URL')}
              />
              <ValueItem
                text="lcd"
                value={customConfig.LCD_URL}
                onChange={(e) => onChangeValue(e, 'LCD_URL')}
              />
              <ValueItem
                text="index"
                value={customConfig.INDEX_HTTPS}
                onChange={(e) => onChangeValue(e, 'INDEX_HTTPS')}
              />
              <ValueItem
                text="index wss"
                value={customConfig.INDEX_WEBSOCKET}
                onChange={(e) => onChangeValue(e, 'INDEX_WEBSOCKET')}
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
