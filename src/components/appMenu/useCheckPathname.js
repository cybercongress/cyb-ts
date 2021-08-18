import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useCheckPathname = () => {
  const location = useLocation();
  const [main, setMain] = useState('Oracle');

  useEffect(() => {
    const { pathname } = location;
    console.log(`pathname`, pathname);
    if (pathname.match(/pocket/gm) && pathname.match(/pocket/gm).length > 0) {
      setMain('My robot');
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
    } else if (
      pathname.match(/market/gm) &&
      pathname.match(/market/gm).length > 0
    ) {
      setMain('Market');
    } else if (pathname === '/market/GOL') {
      setMain('Market');
    } else if (pathname === '/market/amper') {
      setMain('Market');
    } else if (pathname === '/market/volt') {
      setMain('Market');
    } else if (pathname === '/market/cyb') {
      setMain('Market');
    } else if (pathname === '/search/Dyson Sphere') {
      setMain('Dyson Sphere');
    } else if (pathname === '/mint') {
      setMain('Dyson Sphere');
    } else if (
      pathname.match(/energy/gm) &&
      pathname.match(/energy/gm).length > 0
    ) {
      setMain('Dyson Sphere');
    } else if (
      pathname.match(/sixthSense/gm) &&
      pathname.match(/sixthSense/gm).length > 0
    ) {
      setMain('Sixth Sense');
    } else if (pathname === '/portal') {
      setMain('Portal');
    } else if (pathname === '/portal/leaderboard') {
      setMain('Portal');
    } else if (pathname === '/portal/cyber-vs-corp') {
      setMain('Portal');
    } else if (pathname === '/portal/cyber-vs-gov') {
      setMain('Portal');
    } else if (pathname === '/portal/progress') {
      setMain('Portal');
    } else if (
      pathname.match(/senate/gm) &&
      pathname.match(/senate/gm).length > 0
    ) {
      setMain('Senate');
    } else if (
      pathname.match(/halloffame/gm) &&
      pathname.match(/halloffame/gm).length > 0
    ) {
      setMain('Hall of Fame');
    } else if (pathname === '/halloffame/jailed') {
      setMain('Hall of Fame');
    } else if (pathname === '/search/Become a Hero') {
      setMain('Hall of Fame');
    } else {
      setMain('');
    }
  }, [location.pathname]);

  return { main };
};

export default useCheckPathname;
