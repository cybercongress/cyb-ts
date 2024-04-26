import { useHub } from 'src/contexts/hub';
import DisplayHub from '../ui/DisplayHub';

function Channels() {
  const { channels } = useHub();
  console.log('channels', channels)

  // const dataRow = channels ? 

  return (
    <DisplayHub title="Channels" type="HUB_CHANNELS">
      <div>Channels</div>
    </DisplayHub>
  );
}

export default Channels;
