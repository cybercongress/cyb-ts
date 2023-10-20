import { useParams } from 'react-router-dom';

import { getGraphQLQuery } from '../../utils/search/utils';
import { Loading } from '../../components';
import { useEffect, useState, useRef, useCallback, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { PORTAL_ID } from '../application/App';
import { useRobotContext } from 'src/pages/robot/robot.context';
import { ForceGraph3D } from 'react-force-graph';

type Props = {
  data: any;
  currentAddress?: string;
  size?: number;
};

function ForceGraph({ data, size }: Props) {
  const fgRef = useRef(null);

  // useEffect(() => {
  //   let t = 0;

  //   setInterval(() => {
  //     t = t + 10;
  //     fgRef.current.cameraPosition([{ y: t }], undefined, 500);
  //   }, 1000);
  // }, [fgRef]);

  // const [touched, setTouched] = useState(false);

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
    console.error('ForceGraph3D engine stopped!');
    // setHasLoaded(false);
  }, []);

  const distance = 1000;

  useEffect(() => {
    if (!fgRef.current) {
      return;
    }

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
      clearInterval(interval);
    };
  }, [fgRef]);

  return (
    <ForceGraph3D
      // width={window.innerWidth * 0.62}
      // height={600}
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
  );
}

export default ForceGraph;
