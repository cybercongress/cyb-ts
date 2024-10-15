import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MainContainer } from 'src/components';
// import styles from './Layout.module.scss';

function Layout() {
  return (
    <MainContainer width="72%">
      <div>
        <Helmet>
          <title>energy | cyb</title>
        </Helmet>

        <Outlet />
      </div>
    </MainContainer>
  );
}

export default Layout;
