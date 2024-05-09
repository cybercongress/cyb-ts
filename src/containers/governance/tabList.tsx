import { Tabs } from 'src/components';
import { useLocation } from 'react-router-dom';
import { TypePages } from './type';

function TabListGoverance() {
  const location = useLocation();
  const locationSplit = location.pathname.replace(/^\/|\/$/g, '').split('/');
  let active = Object.values(TypePages).find(
    (item) => item === locationSplit[2]
  );
  if (!active) {
    return null;
  }
  return (
    <Tabs
      selected={active}
      options={Object.keys(TypePages).map((key) => ({ to: key, key }))}
    />
  );
}

export default TabListGoverance;
