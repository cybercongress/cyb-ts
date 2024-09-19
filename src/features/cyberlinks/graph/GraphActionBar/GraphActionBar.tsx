import { ActionBar as ActionBarComponent } from 'src/components';
import GraphFullscreenBtn, {
  useFullscreen,
} from '../../GraphFullscreenBtn/GraphFullscreenBtn';

function GraphActionBar({ children }: { children?: React.ReactNode }) {
  const { isFullscreen } = useFullscreen();
  return (
    <ActionBarComponent>
      {!isFullscreen && children}
      <GraphFullscreenBtn />
    </ActionBarComponent>
  );
}

export default GraphActionBar;
