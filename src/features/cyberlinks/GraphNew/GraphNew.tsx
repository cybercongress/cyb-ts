import { scaleSymlog } from 'd3-scale';
import { useState, useRef, useMemo, useEffect } from 'react';
import {
  CosmographProvider,
  Cosmograph,
  CosmographRef,
  CosmographSearchRef,
} from '@cosmograph/react';
import { Node } from './data';
// import './styles.css';
import styles from './GraphNew.module.scss';
import GraphHoverInfo from '../CyberlinksGraph/GraphHoverInfo/GraphHoverInfo';

export default function GraphNew({ address, data, size }) {
  const cosmograph = useRef<CosmographRef>();
  // const histogram = useRef<CosmographHistogramRef<Node>>();
  // const timeline = useRef<CosmographTimelineRef<Link>>();
  const search = useRef<CosmographSearchRef>();
  const [degree, setDegree] = useState<number[]>([]);

  const [hoverNode, setHoverNode] = useState(null);
  const [nodePostion, setNodePostion] = useState(null);

  const nodes = useMemo(() => {
    return (
      data?.nodes?.map((node) => {
        return {
          ...node,
          size: 0.5,
          // value: 1,
          color: 'rgba(0,100,235,1)',
        };
      }) ?? []
    );
  }, [data]);

  const links = useMemo(() => {
    return (
      data?.links?.map((link) => {
        return {
          ...link,
          width: 2.5,
          color: 'rgba(9,255,13,1)',
        };
      }) ?? []
    );
  }, [data]);

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

  const [showLabelsFor, setShowLabelsFor] = useState<Node[] | undefined>(
    undefined
  );
  const [selectedNode, setSelectedNode] = useState<Node | undefined>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cosmograph.current?.pause();
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.total}>
        <p>total nodes: {nodes.length} </p>
        <p>total links: {links.length} </p>
      </div>
      <GraphHoverInfo
        node={hoverNode}
        left={nodePostion?.x}
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
            onClick={() => {
              cosmograph.current?.pause();
            }}
            showLabelsFor={showLabelsFor}
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
    </div>
  );
}
