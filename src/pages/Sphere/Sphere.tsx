import { Route, Routes } from 'react-router-dom';
import SphereContextProvider from './Sphere.context';
import Layout from './Layout/Layout';
import Heroes from './pages/containers/Heroes/Heroes';
import HeroDetails from './pages/containers/HeroDetails';

function SphereRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Heroes />} />
        <Route path="hero/:address/" element={<HeroDetails />} />
      </Route>
    </Routes>
  );
}

function Sphere() {
  return (
    <SphereContextProvider>
      <SphereRoutes />
    </SphereContextProvider>
  );
}

export default Sphere;
