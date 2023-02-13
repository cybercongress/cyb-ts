import React from 'react';
import styles from './styles.scss';
import useCanvas from './useCanvas';

function Canvas() {
  const { canvasRef } = useCanvas();

  return (
    <canvas
      className={styles.slider}
      ref={canvasRef}
      id="canvasOne"
      width="300"
      height="320"
    />
  );
}

export default Canvas;
