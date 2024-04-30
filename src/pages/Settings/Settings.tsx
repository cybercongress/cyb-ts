import { Route, Routes } from 'react-router-dom';
import IpfsSettings from 'src/features/ipfs/ipfsSettings';
import Layout from './Layout/Layout';
import Keys from '../Keys/Keys';
import Tokens from '../Hub/Tokens/Tokens';
import Channels from '../Hub/Channels/Channels';
import Networks from '../Hub/Networks/Networks';

function Settings() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IpfsSettings />} />
        <Route path="keys" element={<Keys />} />
        <Route path="tokens" element={<Tokens />} />
        <Route path="networks" element={<Networks />} />
        <Route path="channels" element={<Channels />} />
      </Route>
    </Routes>
  );
}

export default Settings;
