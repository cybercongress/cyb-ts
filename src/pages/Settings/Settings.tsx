import { Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Keys from '../Keys/Keys';
import Tokens from '../Hub/Tokens/Tokens';
import Channels from '../Hub/Channels/Channels';
import Networks from '../Hub/Networks/Networks';
import IpfsSettings from 'src/features/ipfs/ipfsSettings';

function Settings() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="drive" element={<IpfsSettings />} />
        <Route path="keys" element={<Keys />} />
        <Route path="tokens" element={<Tokens />} />
        <Route path="networks" element={<Networks />} />
        <Route path="channels" element={<Channels />} />
      </Route>
    </Routes>
  );
}

export default Settings;
