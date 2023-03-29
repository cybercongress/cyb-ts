import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '../../routes';

const useCheckPathname = () => {
  const location = useLocation();
  const [main, setMain] = useState('Oracle');

  useEffect(() => {
    const { pathname } = location;

    if (pathname.match(/pocket/gm) && pathname.match(/pocket/gm).length > 0) {
      setMain('My robot');
    } else if (
      pathname.match(/genesis/gm) &&
      pathname.match(/genesis/gm).length > 0
    ) {
      setMain('Genesis');
    } else if (pathname === '/token/TOCYB') {
      setMain('Genesis');
    } else if (pathname === '/token/CYB') {
      setMain('Genesis');
    } else if (pathname === '/token/BOOT') {
      setMain('Genesis');
    } else if (
      pathname.match(/oracle/gm) &&
      pathname.match(/oracle/gm).length > 0
    ) {
      setMain('Oracle');
    } else if (pathname === '/network/bostrom/tx') {
      setMain('Oracle');
    } else if (pathname === '/graph') {
      setMain('Oracle');
    } else if (pathname === '/particles') {
      setMain('Oracle');
    } else if (pathname === '/network/bostrom/block') {
      setMain('Oracle');
    } else if (pathname === '/search/richlist') {
      setMain('Oracle');
    } else if (pathname === '/search/Dyson Sphere') {
      setMain('Dyson Sphere');
    } else if (pathname === '/search/hfr') {
      setMain('HFR');
    } else if (pathname === routes.hfr.path) {
      setMain('HFR');
    } else if (pathname === '/token/A') {
      setMain('HFR');
    } else if (pathname === '/token/V') {
      setMain('HFR');
    } else if (pathname === '/search/grid') {
      setMain('Grid');
    } else if (pathname === '/grid') {
      setMain('Grid');
    } else if (pathname === '/grid/income') {
      setMain('Grid');
    } else if (pathname === '/grid/outcome') {
      setMain('Grid');
    } else if (
      pathname.match(/sixthSense/gm) &&
      pathname.match(/sixthSense/gm).length > 0
    ) {
      setMain('Sixth Sense');
    } else if (pathname === '/search/portal') {
      setMain('Portal');
    } else if (pathname === '/portal/cyber-vs-corp') {
      setMain('Portal');
    } else if (pathname === '/portal/cyber-vs-gov') {
      setMain('Portal');
    } else if (pathname === '/nebula') {
      setMain('Nebula');
    } else if (pathname === '/nebula/Create app') {
      setMain('Nebula');
    } else if (
      pathname.match(/senate/gm) &&
      pathname.match(/senate/gm).length > 0
    ) {
      setMain('Senate');
    } else if (pathname === '/search/dyson shpere') {
      setMain('Dyson Sphere');
    } else if (pathname === routes.sphere.path) {
      setMain('Dyson Sphere');
    } else if (pathname === routes.sphereJailed.path) {
      setMain('Dyson Sphere');
    } else if (pathname === '/search/Become a Hero') {
      setMain('Dyson Sphere');
    } else if (pathname === '/search/biosynthesis reactor') {
      setMain('Biosynthesis Reactor');
    } else if (pathname === '/token/H') {
      setMain('Biosynthesis Reactor');
    } else if (
      pathname.match(/teleport/gm) &&
      pathname.match(/teleport/gm).length > 0
    ) {
      setMain('Teleport');
    } else if (pathname === '/search/great web') {
      setMain('Great Web');
    } else if (pathname === '/search/greatweb foundation') {
      setMain('Great Web');
    } else if (pathname === '/token/GOL') {
      setMain('Great Web');
    } else {
      setMain('');
    }
  }, [location.pathname]);

  return { main };
};

// eslint-disable-next-line import/no-unused-modules
export default useCheckPathname;
