import { Route, Routes } from 'react-router-dom';
import Tokens from './Tokens/Tokens';
import Layout from './Layout/Layout';
import Networks from './Networks/Networks';
import Channels from './Channels/Channels';

function Hub() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="tokens" element={<Tokens />} />
        <Route path="networks" element={<Networks />} />
        <Route path="channels" element={<Channels />} />
      </Route>
    </Routes>
  );
}

export default Hub;
