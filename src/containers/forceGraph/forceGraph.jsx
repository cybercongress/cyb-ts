import React from 'react';
import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
} from 'react-force-graph';

const data = {
  directed: true,
  multigraph: false,
  nodes: [
    {
      id: 'id1',
      // name: 'name1',
      // val: 1,
    },
    {
      id: 'id2',
      // name: 'name2',
      // val: 10,
    },
  ],
  links: [
    {
      source: 'id1',
      target: 'id2',
    },
  ],
};

const ForceGraph = () => {
  return (
    <div>
      <ForceGraph3D
        nodeAutoColorBy="group"
        showNavInfo
        nodeLabel="name"
        graphData={data}
      />
    </div>
  );
};

export default ForceGraph;
