import { scaleSymlog } from 'd3-scale';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  CosmographProvider,
  Cosmograph,
  CosmographRef,
  CosmographHistogramRef,
  CosmographTimelineRef,
  CosmographSearchRef,
  CosmographInputConfig,
} from '@cosmograph/react';
import { Node, Link } from './data';
// import './styles.css';
import styles from './GraphNew.module.scss';
import GraphHoverInfo from '../CyberlinksGraph/GraphHoverInfo/GraphHoverInfo';

export default function GraphNew({ address, data, size }) {
  const cosmograph = useRef<CosmographRef>();
  const histogram = useRef<CosmographHistogramRef<Node>>();
  const timeline = useRef<CosmographTimelineRef<Link>>();
  const search = useRef<CosmographSearchRef>();
  const [degree, setDegree] = useState<number[]>([]);

  const [hoverNode, setHoverNode] = useState(null);
  const [nodePostion, setNodePostion] = useState(null);

  // const { data } = useCyberlinks(
  //   {
  //     address,
  //   },
  //   {
  //     limit: 1024,
  //   }
  // );

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

  // console.log(data);

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

  const onCosmographClick = useCallback<
    Exclude<CosmographInputConfig<Node, Link>['onClick'], undefined>
  >((n) => {
    search?.current?.clearInput();
    if (n) {
      cosmograph.current?.selectNode(n);
      setShowLabelsFor([n]);
      setSelectedNode(n);
    } else {
      cosmograph.current?.unselectNodes();
      setShowLabelsFor(undefined);
      setSelectedNode(undefined);
    }
  }, []);

  // const onSearchSelectResult = useCallback<
  //   Exclude<CosmographSearchInputConfig<Node>['onSelectResult'], undefined>
  // >((n) => {
  //   setShowLabelsFor(n ? [n] : undefined);
  //   setSelectedNode(n);
  // }, []);

  console.log(nodePostion);

  return (
    <div className={styles.wrapper}>
      <GraphHoverInfo
        node={hoverNode}
        // left={nodePostion?.[0]}
        // top={nodePostion?.[1]}
        left={500}
        top={500}
        // camera={fgRef.current?.camera()}
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
            // spaceSize={size}
            className={styles.cosmographStyle}
            showTopLabels
            showTopLabelsLimit={10}
            showFPSMonitor
            backgroundColor="transparent"
            showDynamicLabels={false}
            showLabelsFor={showLabelsFor}
            nodeLabelColor="white"
            hoveredNodeLabelColor="white"
            nodeSize={(n) => n.size ?? null}
            // nodeColor={nodeColor}
            nodeColor={(d) => d.color}
            linkColor={(d) => d.color}
            onNodeMouseOver={(n, _, position) => {
              setHoverNode(n);
              setNodePostion(position);
            }}
            onNodeMouseOut={() => {
              setHoverNode(null);
              setNodePostion(null);
            }}
            // linkWidth={(l: Link) => l.width ?? null}
            // linkColor={(l: Link) => l.color ?? null}
            curvedLinks
            onClick={onCosmographClick}
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
