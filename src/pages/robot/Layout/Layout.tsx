import { Outlet } from 'react-router-dom';
import Loader2 from 'src/components/ui/Loader2';
import { MainContainer } from 'src/components';
import { useRobotContext } from '../robot.context';
import WrappedActionBar from './WrappedActionBar';
import useMenuCounts from './useMenuCounts';
import RobotHeader from './RobotHeader/RobotHeader';

function Layout() {
  const { address, isLoading, nickname, isOwner } = useRobotContext();

  const counts = useMenuCounts(address);

  const title = `robot ${nickname || address || ''}`;

  return (
    <MainContainer title={title}>
      {isLoading ? (
        <Loader2 />
      ) : (
        <>
          {!isOwner && <RobotHeader menuCounts={counts} />}
          <Outlet />

          <WrappedActionBar />
        </>
      )}
    </MainContainer>
  );
}

export default Layout;
