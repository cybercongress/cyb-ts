import * as THREE from 'three';
import ContentItem from 'src/components/ContentItem/contentItem';
import { useMemo } from 'react';
import styles from './GraphHoverInfo.module.scss';

// fix
type Props = {
  node: any;
  camera: any;
  size: number;
};

function HoverInfo({ node, camera, size }: Props) {
  const calc = useMemo(() => {
    if (!node || !camera) {
      return null;
    }

    const { x, y, z } = node;
    const vector = new THREE.Vector3(x, y, z);
    vector.project(camera);

    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    const posX = vector.x * widthHalf + widthHalf;
    const posY = -(vector.y * heightHalf) + heightHalf;

    return {
      posX,
      posY,
    };
  }, [camera, node]);

  if (!calc) {
    return null;
  }

  const { posX, posY } = calc;

  const isCid = node.id.startsWith('Qm');

  if (!isCid) {
    // debug, delete
    debugger;
  }

  return (
    <div
      className={styles.hoverInfo}
      style={{
        top: posY,
        left: posX,
      }}
    >
      <ContentItem cid={node.id} />
    </div>
  );
}

export default HoverInfo;
