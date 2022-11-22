import React, { useContext } from 'react';
import { AppContext } from '../../context';
import { MainContainer } from '../portal/components';

const ValueItem = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
    {children}
  </div>
);

function ListNetwork() {
  const { networks } = useContext(AppContext);

  const renderItem = Object.keys(networks).map((key) => {
    const item = networks[key];
    return (
      <div style={{ gap: '5px', display: 'grid' }}>
        <ValueItem>
          <div>chainId</div>
          <div>{key}</div>
        </ValueItem>
        <ValueItem>
          <div>prefix</div>
          <div>{item.BECH32_PREFIX_ACC_ADDR_CYBER}</div>
        </ValueItem>
        <ValueItem>
          <div>denom</div>
          <div>{item.DENOM_CYBER}</div>
        </ValueItem>
        <ValueItem>
          <div>liquid denom</div>
          <div>{item.DENOM_LIQUID_TOKEN}</div>
        </ValueItem>
        <ValueItem>
          <div>rpc</div>
          <div>{item.CYBER_NODE_URL_API}</div>
        </ValueItem>
        <ValueItem>
          <div>lcd</div>
          <div>{item.CYBER_NODE_URL_LCD}</div>
        </ValueItem>
        <ValueItem>
          <div>index</div>
          <div>{item.CYBER_INDEX_HTTPS}</div>
        </ValueItem>
      </div>
    );
  });

  return <MainContainer>{renderItem}</MainContainer>;
}

export default ListNetwork;
