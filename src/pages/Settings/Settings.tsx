import { Route, Routes } from 'react-router-dom';
import IpfsSettings from 'src/features/ipfs/ipfsSettings';
import Layout from './Layout/Layout';
import Keys from '../Keys/Keys';
import Hub from '../Hub/hub';
import Audio from './Audio/Audio';
import Hotkeys from '../robot/Hotkeys/Hotkeys';
import LLM from './LLM/LLM';

function Settings() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IpfsSettings />} />
        <Route path="keys" element={<Keys />} />
        <Route path="audio" element={<Audio />} />
        <Route path="llm" element={<LLM />} />

        <Route path="hotkeys" element={<Hotkeys />} />

        <Route path="/*" element={<Hub />} />
      </Route>
    </Routes>
  );
}

export default Settings;
