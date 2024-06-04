import { Route, Routes } from 'react-router-dom';
import IpfsSettings from 'src/features/ipfs/ipfsSettings';
import Layout from './Layout/Layout';
import Keys from '../Keys/Keys';
import Hub from '../Hub/hub';

function Settings() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IpfsSettings />} />
        <Route path="keys" element={<Keys />} />

        <Route path="/*" element={<Hub />} />
      </Route>
    </Routes>
  );
}

export default Settings;
