import { Routes, Route } from 'react-router-dom';
import Swap from '../swap';
import Send from '../send';
import Bridge from '../bridge';
import TeleportMainScreen from './mainScreen/mainScreen';

function TeleportRouter() {
  return (
    <Routes>
      <Route index element={<TeleportMainScreen />} />
      <Route path="swap" element={<Swap />} />
      <Route path="send" element={<Send />} />
      <Route path="bridge" element={<Bridge />} />
    </Routes>
  );
}

function Teleport() {
  return <TeleportRouter />;
}

export default Teleport;
