import { Text, Pane } from '@cybercongress/gravity';
import Activites from './Activites';
import { ContainerGradient } from '../portal/components';

function Msgs({ data }) {
  return (
    <ContainerGradient
      userStyleContent={{ height: 'auto' }}
      togglingDisable
      title={
        <Text color="#fff" fontSize="20px" fontWeight="500" lineHeight="1.5">
          Msgs
        </Text>
      }
    >
      <Pane display="flex" width="100%" flexDirection="column">
        {data.map((msg, index) => (
          <Activites key={index} msg={msg} />
        ))}
      </Pane>
    </ContainerGradient>
  );
}

export default Msgs;
