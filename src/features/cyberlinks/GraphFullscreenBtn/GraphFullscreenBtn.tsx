import { PORTAL_ID } from 'src/containers/application/App';
import { useState } from 'react';
import useEventListener from 'src/hooks/dom/useEventListener';
import { Button } from 'src/components';
import styles from './GraphFullscreenBtn.module.scss';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement !== null);
  };

  useEventListener('fullscreenchange', handleFullscreenChange, document);

  function toggleFullscreen(element?: HTMLElement = document) {
    if (!document.fullscreenElement) {
      element.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  return {
    isFullscreen,
    toggleFullscreen,
  };
}

function GraphFullscreenBtn() {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  function onClick() {
    if (!document.fullscreenElement) {
      toggleFullscreen(document.getElementById(PORTAL_ID));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  return (
    <Button className={styles.btn} onClick={onClick}>
      {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    </Button>
  );
}

export default GraphFullscreenBtn;
