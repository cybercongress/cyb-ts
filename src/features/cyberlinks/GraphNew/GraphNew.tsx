import { scaleSymlog } from 'd3-scale';
import { useState, useRef, useMemo, useEffect } from 'react';
import {
  CosmographProvider,
  Cosmograph,
  CosmographRef,
} from '@cosmograph/react';

import { CosmosInputNode, CosmosInputLink } from '@cosmograph/cosmos';
import { Button } from 'src/components';
import { Node } from './data';
import styles from './GraphNew.module.scss';
import { useFullscreen } from '../GraphFullscreenBtn/GraphFullscreenBtn';
import { useCyberlinkWithWaitAndAdviser } from '../hooks/useCyberlink';
import GraphHoverInfo from '../CyberlinksGraph/GraphHoverInfo/GraphHoverInfo';
import GraphActionBar from '../graph/GraphActionBar/GraphActionBar';

export default function GraphNew({ address, data, size }) {
  const cosmograph = useRef<CosmographRef>();
  // const histogram = useRef<CosmographHistogramRef<Node>>();
  // const timeline = useRef<CosmographTimelineRef<Link>>();
  // const search = useRef<CosmographSearchRef>();

  const [degree, setDegree] = useState<number[]>([]);

  // max 2 nodes
  const [selectedNodes, setSelectedNodes] = useState<CosmosInputNode[]>([]);

  const [localData, setLocalData] = useState<{
    nodes: CosmosInputNode[];
    links: CosmosInputLink[];
  }>({
    links: [],
    nodes: [],
  });

  const [hoverNode, setHoverNode] = useState(null);
  const [nodePostion, setNodePostion] = useState(null);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>();

  const scaleColor = useRef(
    scaleSymlog<string, string>()
      .range(['rgba(80, 105, 180, 0.75)', 'rgba(240, 105, 180, 0.75)'])
      .clamp(true)
  );

  useEffect(() => {
    const degree = cosmograph?.current?.getNodeDegrees();
    if (degree) {
      scaleColor.current.domain([Math.min(...degree), Math.max(...degree)]);
      setDegree(degree);
    }
  }, [degree]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cosmograph.current?.pause();
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  // const nodeColor = useCallback(
  //   (n: Node, index: number) => {
  //     if (index === undefined) {
  //       return null;
  //     }

  //     const degreeValue = degree[index];
  //     if (degreeValue === undefined) {
  //       return null;
  //     }
  //     return scaleColor.current?.(degreeValue);
  //   },
  //   [degree]
  // );

  // const [showLabelsFor, setShowLabelsFor] = useState<Node[] | undefined>(
  //   undefined
  // );

  // const onCosmographClick = useCallback<
  //   Exclude<CosmographInputConfig<Node, Link>['onClick'], undefined>
  // >((n) => {
  //   search?.current?.clearInput();
  //   if (n) {
  //     cosmograph.current?.selectNode(n);
  //     setShowLabelsFor([n]);
  //     setSelectedNode(n);
  //   } else {
  //     cosmograph.current?.unselectNodes();
  //     setShowLabelsFor(undefined);
  //     setSelectedNode(undefined);
  //   }
  // }, []);

  // const onSearchSelectResult = useCallback<
  //   Exclude<CosmographSearchInputConfig<Node>['onSelectResult'], undefined>
  // >((n) => {
  //   setShowLabelsFor(n ? [n] : undefined);
  //   setSelectedNode(n);
  // }, []);

  function callback() {
    cosmograph.current?.unselectNodes();
    // setShowLabelsFor(undefined);
    setSelectedNode(undefined);

    setLocalData({
      nodes: [
        ...localData.nodes,
        ...selectedNodes.map((node) => ({ ...node, color: 'orange' })),
      ],
      links: [
        ...localData.links,
        {
          source: selectedNodes[0].id,
          target: selectedNodes[1].id,
          color: 'red',
        },
      ],
    });
  }

  const { isFullscreen } = useFullscreen();

  const { links, nodes } = useMemo(() => {
    const nodes = [...data.nodes, ...localData.nodes].map((node) => {
      return {
        ...node,
        size: 0.5,
        // value: 1,
        color: node.color || 'rgba(0,100,235,1)',
      };
    });

    const links = [...data.links, ...localData.links].map((link) => {
      return {
        ...link,
        width: 2.5,
        color: link.color || 'rgba(9,255,13,1)',
      };
    });

    return { links, nodes };
  }, [data, localData]);

  return (
    <div className={styles.wrapper}>
      {!isFullscreen && (
        <div className={styles.total}>
          <p>total nodes: {nodes.length} </p>
          <p>total links: {links.length} </p>
        </div>
      )}
      <GraphHoverInfo
        node={hoverNode}
        left={nodePostion?.x + 50}
        top={nodePostion?.y}
        size={size || window.innerWidth}
      />

      <CosmographProvider nodes={nodes} links={links}>
        {/* <CosmographSearch
          ref={search}
          className="searchStyle"
          onSelectResult={onSearchSelectResult}
          maxVisibleItems={20}
        /> */}
        {nodes.length > 0 && (
          <Cosmograph
            ref={cosmograph}
            className={styles.cosmographStyle}
            // spaceSize={size}
            // showTopLabelsLimit={10}
            // showTopLabels={}
            backgroundColor="transparent"
            showDynamicLabels={false}
            linkArrows={false}
            linkWidth={2}
            onClick={(node) => {
              cosmograph.current?.pause();

              if (node) {
                // setShowLabelsFor([node]);

                // check for duplicate

                let newNodes = [...selectedNodes];

                if (newNodes.length < 2) {
                  newNodes.push(node);
                } else {
                  newNodes = [node];
                }

                setSelectedNodes(newNodes);
                cosmograph.current?.selectNodes(newNodes);
              } else {
                cosmograph.current?.unselectNodes();
                // setShowLabelsFor(undefined);
                setSelectedNodes([]);
              }
            }}
            // showLabelsFor={showLabelsFor}
            showHoveredNodeLabel={false}
            nodeLabelColor="white"
            simulationFriction={0.95}
            simulationDecay={5000}
            hoveredNodeLabelColor="white"
            nodeSize={(n) => n.size ?? null}
            // nodeColor={nodeColor}
            nodeColor={(d) => d.color}
            linkColor={(d) => d.color}
            // linkWidth={(l: Link) => l.width ?? null}
            // linkColor={(l: Link) => l.color ?? null}

            onNodeMouseOver={(n, _, _1, e) => {
              setHoverNode(n);

              if (e) {
                setNodePostion({
                  x: e.clientX,
                  y: e.clientY,
                });
              }
            }}
            onNodeMouseOut={() => {
              setHoverNode(null);
              setNodePostion(null);
            }}
            showFPSMonitor={process.env.NODE_ENV === 'development'}
          />
        )}
        <div className="sidebarStyle">
          {selectedNode ? (
            <div className="infoStyle">
              {`id: ${selectedNode?.id}
            value: ${selectedNode?.value}`}
            </div>
          ) : (
            <></>
          )}
          {/* <div className="histogramWrapper">
            <CosmographHistogram
              className="histogramStyle"
              ref={histogram}
              barCount={100}
            />
          </div> */}
        </div>
        {/* <CosmographTimeline
          className="timelineStyle"
          ref={timeline}
          showAnimationControls
        /> */}
      </CosmographProvider>

      <GraphActionBar>
        <ActionBar selectedNodes={selectedNodes} callback={callback} />
      </GraphActionBar>
    </div>
  );
}

type Props2 = {
  selectedNodes: CosmosInputNode[];
  callback: () => void;
};

function ActionBar({ selectedNodes, callback }: Props2) {
  const { isReady, isLoading, execute } = useCyberlinkWithWaitAndAdviser({
    to: selectedNodes[0]?.id,
    from: selectedNodes[1]?.id,
    callback,
  });

  const { length } = selectedNodes;

  let text;
  if (length !== 2 || length === 0) {
    text = `select ${2 - length}  particle${length === 0 ? 's' : ''}`;
  } else {
    text = 'cyberlink particles';
  }

  return (
    <Button
      onClick={execute}
      disabled={!isReady || selectedNodes.length !== 2}
      pending={isLoading}
    >
      {text}
    </Button>
  );
}
