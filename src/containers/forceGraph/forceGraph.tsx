import { useEffect, useState, useRef, useCallback } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import styles from './CyberlinksGraph.module.scss';

type Props = {
  data: any;
  currentAddress?: string;
  size?: number;
};

// before zoom in
const INITIAL_CAMERA_DISTANCE = 2500;
const DEFAULT_CAMERA_DISTANCE = 1300;
const CAMERA_ZOOM_IN_EFFECT_DURATION = 5000;
const CAMERA_ZOOM_IN_EFFECT_DELAY = 500;

function ForceGraph({ data, size, currentAddress }: Props) {
  const [isRendering, setRendering] = useState(true);
  const [touched, setTouched] = useState(false);

  const fgRef = useRef();

  // initial camera position, didn't find via props
  useEffect(() => {
    if (!fgRef.current) {
      return;
    }
    fgRef.current.cameraPosition({ z: INITIAL_CAMERA_DISTANCE });
  }, [fgRef]);

  // initial loading camera zoom effect
  useEffect(() => {
    if (!fgRef.current || isRendering) {
      return;
    }

    setTimeout(() => {
      fgRef.current.cameraPosition(
        { z: DEFAULT_CAMERA_DISTANCE },
        null,
        CAMERA_ZOOM_IN_EFFECT_DURATION
      );
    }, CAMERA_ZOOM_IN_EFFECT_DELAY);
  }, [fgRef, isRendering]);

  useEffect(() => {
    if (!fgRef.current) {
      return;
    }

    function onTouch() {
      setTouched(true);
    }

    fgRef.current.controls().addEventListener('start', onTouch);

    return () => {
      if (fgRef.current) {
        fgRef.current.controls().removeEventListener('start', onTouch);
      }
    };
  }, [fgRef]);

  // orbit camera
  useEffect(() => {
    if (!fgRef.current || touched || isRendering) {
      return;
    }

    let angle = 0;

    let interval = null;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        fgRef.current.cameraPosition({
          x: DEFAULT_CAMERA_DISTANCE * Math.sin(angle),
          z: DEFAULT_CAMERA_DISTANCE * Math.cos(angle),
        });
        angle += Math.PI / 3000;
      }, 10);
    }, CAMERA_ZOOM_IN_EFFECT_DURATION + CAMERA_ZOOM_IN_EFFECT_DELAY);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [fgRef, touched, isRendering]);

  const handleNodeClick = useCallback(
    (node) => {
      if (!fgRef.current) {
        return;
      }

      const distance = 300;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        5000
      );
    },
    [fgRef]
  );

  const handleLinkClick = useCallback(
    (link) => {
      if (!fgRef.current) {
        return;
      }

      const node = link.target;
      const distance = 300;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        5000
      );
    },
    [fgRef]
  );

  const handleNodeRightClick = useCallback((node) => {
    window.open(`${window.location.origin}/ipfs/${node.id}`, '_blank');
  }, []);

  const handleLinkRightClick = useCallback((link) => {
    window.open(
      `${window.location.origin}/network/bostrom/tx/${link.name}`,
      '_blank'
    );
  }, []);

  const handleEngineStop = useCallback(() => {
    console.log('ForceGraph3D engine stopped!');
    setRendering(false);
  }, []);

  return (
    <div
      style={{
        minHeight: size,
      }}
    >
      {isRendering && (
        <div className={styles.loaderWrapper}>rendering data...</div>
      )}

      <ForceGraph3D
        height={size}
        width={size}
        ref={fgRef}
        graphData={data}
        showNavInfo={false}
        backgroundColor="#000000"
        warmupTicks={420}
        cooldownTicks={0}
        enableNodeDrag={false}
        enablePointerInteraction
        enableNavigationControls
        nodeLabel="id"
        nodeColor={() => 'rgba(0,100,235,1)'}
        nodeOpacity={1.0}
        nodeRelSize={8}
        linkColor={
          // not working
          (link) =>
            // link.subject && link.subject === currentAddress
            //   ? 'red'
            'rgba(9,255,13,1)'
        }
        linkWidth={4}
        linkCurvature={0.2}
        linkOpacity={0.7}
        linkDirectionalParticles={1}
        linkDirectionalParticleColor={() => 'rgba(9,255,13,1)'}
        linkDirectionalParticleWidth={4}
        linkDirectionalParticleSpeed={0.015}
        // linkDirectionalArrowRelPos={1}
        // linkDirectionalArrowLength={10}
        // linkDirectionalArrowColor={() => 'rgba(9,255,13,1)'}

        onNodeClick={handleNodeRightClick}
        onNodeRightClick={handleNodeClick}
        onLinkClick={handleLinkRightClick}
        onLinkRightClick={handleLinkClick}
        onEngineStop={handleEngineStop}
      />
    </div>
  );
}

export default ForceGraph;
