import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNetworks } from 'src/contexts/networks';
import { CHAIN_ID } from 'src/constants/config';
import { useAdviser } from 'src/features/adviser/context';
import { MainContainer } from '../portal/components';
import { ContainerGradientText } from '../../components';
import BtnPasport from '../portal/pasport/btnPasport';

function ValueItem({ children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        color: '#fff',
      }}
    >
      {children}
    </div>
  );
}

const statusCard = (status) => {
  switch (status) {
    case 'bostrom':
      return 'green';
    case 'space-pussy':
      return 'pink';

    default:
      return 'blue';
  }
};

function ListNetwork() {
  const { networks, updateNetworks } = useNetworks();

  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser('runing cyber networks');
  }, [setAdviser]);

  const onClickDeleteAddress = useCallback(
    (key) => {
      const newList = { ...networks };
      delete newList[key];
      updateNetworks(newList);
    },
    [networks, updateNetworks]
  );

  const renderItem =
    networks &&
    Object.keys(networks).map((key) => {
      const item = networks[key];
      return (
        <ContainerGradientText status={statusCard(key)} key={key}>
          {key !== 'bostrom' &&
            key !== 'space-pussy' &&
            key !== CHAIN_ID && (
              <BtnPasport
                onClick={() => onClickDeleteAddress(key)}
                typeBtn="red"
              >
                X
              </BtnPasport>
            )}
          <Link to={`/networks/${key}`}>
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
                <div>{item.BASE_DENOM}</div>
              </ValueItem>
              <ValueItem>
                <div>liquid denom</div>
                <div>{item.DENOM_LIQUID}</div>
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
          </Link>
        </ContainerGradientText>
      );
    });

  return <MainContainer>{renderItem}</MainContainer>;
}

export default ListNetwork;
