import { ContainerGradientText } from '../../../components';
import { MainContainer } from '../../../containers/portal/components';
import ComponentLoader from './ipfsComponents/ipfsLoader';

function PendingIpfsSettings() {
  return (
    <MainContainer>
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        <ComponentLoader style={{ margin: '10px auto', width: '100px' }} />
      </ContainerGradientText>
    </MainContainer>
  );
}

export default PendingIpfsSettings;
