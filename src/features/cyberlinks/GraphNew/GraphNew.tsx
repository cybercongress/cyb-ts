import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  CosmographProvider,
  Cosmograph,
  CosmographRef,
} from '@cosmograph/react';

import { CosmosInputNode, CosmosInputLink } from '@cosmograph/cosmos';
import { Button } from 'src/components';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import useGraphLimit from 'src/pages/robot/Brain/useGraphLimit';
import { useLocation } from 'react-router-dom';
import { isDevEnv } from 'src/utils/dev';
import useForceUpdate from 'src/hooks/react/useForceUpdate';
import { scaleSymlog } from 'd3-scale';
import styles from './GraphNew.module.scss';
import { useCyberlinkWithWaitAndAdviser } from '../hooks/useCyberlink';
import GraphHoverInfo from '../CyberlinksGraph/GraphHoverInfo/GraphHoverInfo';
import GraphActionBar from '../graph/GraphActionBar/GraphActionBar';

function GraphNew({ address, data, size }) {
  const cosmograph = useRef<CosmographRef>();
  // const histogram = useRef<CosmographHistogramRef<Node>>();
  // const timeline = useRef<CosmographTimelineRef<Link>>();
  // const search = useRef<CosmographSearchRef>();

  const location = useLocation();

  const [degree, setDegree] = useState<number[]>([]);

  const { limit, isCurvedStyle } = useGraphLimit();

  const [localData, setLocalData] = useState<{
    nodes: CosmosInputNode[];
    links: CosmosInputLink[];
  }>({
    links: [],
    nodes: [],
  });

  const [hoverNode, setHoverNode] = useState<CosmosInputNode>();

  const { forceUpdate } = useForceUpdate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cosmograph.current?.pause();
    }, 6000);
    return () => clearTimeout(timeoutId);
  }, []);

  // const onSearchSelectResult = useCallback<
  //   Exclude<CosmographSearchInputConfig<Node>['onSelectResult'], undefined>
  // >((n) => {
  //   setShowLabelsFor(n ? [n] : undefined);
  //   setSelectedNode(n);
  // }, []);

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

  const selectedNodes = cosmograph.current?.getSelectedNodes()?.reverse();
  console.log('selectedNodes', selectedNodes);

  function callback() {
    debugger;

    setLocalData({
      ...localData,

      links: [
        ...localData.links,
        {
          source: selectedNodes[0].id,
          target: selectedNodes[1].id,
          color: 'red',
        },
      ],
    });

    cosmograph.current?.unselectNodes();
  }

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
        width: 3.5,
        color: link.color || 'rgba(9,255,13,1)',
      };
    });

    return { links, nodes };
  }, [data, localData]);

  useAdviserTexts({
    defaultText: useMemo(() => {
      return (
        <>
          {/* @nick (or) your */}
          public brain, with {nodes.length} particles and {links.length}{' '}
          cyberlinks
          <br />
          The limit is {limit}
        </>
      );
    }, [nodes.length, links.length, limit]),
  });

  function renderInfo(node, position?: string) {
    const xOffset = 100;
    const toRight = position === 'right';

    return (
      <GraphHoverInfo
        node={node}
        left={!toRight ? xOffset : undefined}
        right={toRight ? xOffset : undefined}
        top="42.5vh"
        size={size || window.innerWidth}
      />
    );
  }

  const handleNodeSelection = useCallback(
    (node?: CosmosInputNode) => {
      if (!node) {
        cosmograph.current?.unselectNodes();
        forceUpdate();
        return;
      }

      let newNodes = [...(selectedNodes || [])];

      // check for duplicate
      if (newNodes.find((n) => n.id === node.id)) {
        newNodes = newNodes.filter((n) => n.id !== node.id);
      } else if (newNodes.length < 2) {
        newNodes.push(node);
      } else {
        newNodes = [node];
      }

      if (newNodes.length === 0) {
        cosmograph.current?.unselectNodes();
      } else {
        cosmograph.current?.selectNodes(newNodes);
        forceUpdate();
      }
    },
    [selectedNodes, forceUpdate]
  );

  const selectedNodeIds = selectedNodes?.map((n) => n.id) || [];

  const selectedNodesToRender = selectedNodes || [];

  return (
    <div className={styles.wrapper}>
      {/* complex checks, change carefully */}
      {(selectedNodesToRender[0] || hoverNode) &&
        renderInfo(
          (hoverNode &&
          // (selectedNodesToRender[1] && selectedNodesToRender[1].id !== hoverNode.id))
          selectedNodesToRender.length === 0
            ? hoverNode
            : false) || selectedNodesToRender[0]
        )}

      {(selectedNodesToRender[1] ||
        (hoverNode && selectedNodesToRender.length === 1)) &&
        renderInfo(
          (hoverNode &&
          // render right only if first node selected
          selectedNodesToRender.length === 1 &&
          selectedNodesToRender[0].id !== hoverNode.id
            ? hoverNode
            : false) || selectedNodesToRender[1],
          'right'
        )}

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
            focusedNodeRingColor="rgba(243, 30, 30, 0.5)"
            curvedLinks={isCurvedStyle}
            // showLabelsFor={showLabelsFor}
            showHoveredNodeLabel={false}
            nodeLabelColor="white"
            simulationFriction={0.95}
            simulationDecay={5000}
            nodeGreyoutOpacity={0.35}
            linkGreyoutOpacity={0.35}
            hoveredNodeLabelColor="white"
            nodeSize={(n) => n.size ?? null}
            // nodeColor={nodeColor}
            nodeColor={(d) => {
              return selectedNodeIds.includes(d.id)
                ? 'rgb(246, 43, 253)'
                : d.color;
            }}
            linkColor={(d) => d.color}
            // linkWidth={(l: Link) => l.width ?? null}
            // linkColor={(l: Link) => l.color ?? null}

            onClick={(node) => {
              handleNodeSelection(node);

              if (!cosmograph.current?.isSimulationRunning && !node) {
                cosmograph.current?.restart();
              } else {
                cosmograph.current?.pause();
              }
            }}
            onNodeMouseOver={(n) => {
              cosmograph.current?.pause();
              setHoverNode(n);
            }}
            onNodeMouseOut={() => {
              setHoverNode(undefined);
            }}
            showFPSMonitor={isDevEnv()}
          />
        )}

        {/* <CosmographTimeline
          className="timelineStyle"
          ref={timeline}
          showAnimationControls
        /> */}
      </CosmographProvider>

      {location.pathname !== '/brain' && (
        <GraphActionBar>
          <ActionBar
            selectedNodes={selectedNodesToRender}
            callback={callback}
          />
        </GraphActionBar>
      )}
    </div>
  );
}

export default GraphNew;

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
