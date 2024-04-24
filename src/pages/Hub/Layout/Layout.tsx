import { Outlet } from 'react-router-dom';
import { MainContainer } from 'src/components';
import styles from './Layout.module.scss';

function Layout() {
  return (
    <MainContainer width="100%">
      <div className={styles.container}>
        <Outlet />
      </div>
    </MainContainer>
  );
}

export default Layout;
