import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ForceGraph3D } from 'react-force-graph';
import { getGraphQLQuery } from '../../utils/search/utils';
import { Loading } from '../../components';
import { createPortal } from 'react-dom';
import { PORTAL_ID } from '../application/App';
import { useRobotContext } from 'src/pages/robot/robot.context';

type Props = {
  data: any;
  currentAddress?: string;
  size?: number;
};

function ForceGraph({ data, size }: Props) {
  const fgRef = useRef<typeof ForceGraph3D>();

  // useEffect(() => {
  //   let t = 0;

  //   setInterval(() => {
  //     t = t + 10;
  //     fgRef.current.cameraPosition([{ y: t }], undefined, 500);
  //   }, 1000);
  // }, [fgRef]);

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
  );
}

export default ForceGraph;
