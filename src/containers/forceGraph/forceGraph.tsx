import { useEffect, useState, useRef, useCallback } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import styles from './CyberlinksGraph.module.scss';

type Props = {
  data: any;
  currentAddress?: string;
  size?: number;
};

function ForceGraph({ data, size, currentAddress }: Props) {
  const [isRendering, setRendering] = useState(true);
  const [touched, setTouched] = useState(false);

  const fgRef = useRef();

  useEffect(() => {
    if (!fgRef.current || touched) {
      return;
    }

    function onTouch() {
      setTouched(true);
    }

    fgRef.current.controls().addEventListener('start', onTouch);

    const distance = 1000;
    fgRef.current.cameraPosition({ z: distance });

    // camera orbit
    let angle = 0;
    const interval = setInterval(() => {
      fgRef.current.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle),
      });
      angle += Math.PI / 2000;
    }, 10);

    return () => {
      if (fgRef.current) {
        fgRef.current.controls().removeEventListener('start', onTouch);
      }

      clearInterval(interval);
    };
  }, [fgRef, touched]);

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
        // cameraDistance={500}
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
        // onZoomEnd={() => {
        //   debugger;
        // }}
        // onZoom={() => {
        //   debugger;
        // }}
        // onNodeDrag={() => {
        //   debugger;
        // }}
        // onBackgroundClick={() => {
        //   debugger;
        // }}
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
