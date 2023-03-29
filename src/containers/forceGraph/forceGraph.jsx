import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ForceGraph3D } from 'react-force-graph';
import { getGraphQLQuery } from '../../utils/search/utils';
import { Loading } from '../../components';

function ForceGraph() {
  const params = useParams();
  let graph;

  const [hasLoaded, setHasLoaded] = useState(true);
  const [data, setItems] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const fgRef = useRef();

  const limit = 1024;
  let where;

  useEffect(() => {
    const feachData = async () => {
      if (params.agent) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        where = `{neuron: {_eq: "${params.agent}"}}`;
      } else {
        where = '{}';
      }
      const GET_CYBERLINKS = `
      query Cyberlinks {
        cyberlinks(limit: ${String(
          limit
        )}, order_by: {height: desc}, where: ${where}) {
          particle_from
          particle_to
          neuron
          transaction_hash
        }
      }
      `;
      const { cyberlinks } = await getGraphQLQuery(GET_CYBERLINKS);
      const from = cyberlinks.map((a) => a.particle_from);
      const to = cyberlinks.map((a) => a.particle_to);
      const set = new Set(from.concat(to));
      const object = [];
      set.forEach((value) => {
        object.push({ id: value });
      });

      for (let i = 0; i < cyberlinks.length; i++) {
        cyberlinks[i] = {
          source: cyberlinks[i].particle_from,
          target: cyberlinks[i].particle_to,
          name: cyberlinks[i].transaction_hash,
          subject: cyberlinks[i].subject,
          // curvative: getRandomInt(20, 500) / 1000,
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      graph = {
        nodes: object,
        links: cyberlinks,
      };
      setItems(graph);
      setLoading(false);
    };
    feachData();
  }, [params]);

  const handleNodeClick = useCallback(
    (node) => {
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

  const handleNodeRightClick = useCallback(
    (node) => {
      window.open(`${window.location.origin}/ipfs/${node.id}`, '_blank');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fgRef]
  );

  const handleLinkRightClick = useCallback(
    (link) => {
      window.open(
        `${window.location.origin}/network/bostrom/tx/${link.name}`,
        '_blank'
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fgRef]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEngineStop = useCallback(() => {
    console.log('engine stopped!');
    setHasLoaded(false);
  });

  // const handleNewLink = useCallback(subscription => {
  //   let link = subscription["subscriptionData"].data["cyberlink"][0]
  //     let { nodes, links } = data;
  //     let l = {
  //       source: link["object_from"],
  //       target: link["object_to"],
  //       name: link["txhash"]
  //     }

  //     if (!nodes.some(node => node["id"] == l["source"])) {
  //       nodes.push({id: l["source"]})
  //     }

  //     if (!nodes.some(node => node["id"] == l["target"])) {
  //       nodes.push({id: l["target"]})
  //     }

  //     setItems({
  //         nodes: [...nodes],
  //         links: [...links, {
  //           source: l["source"],
  //           target: l["target"],
  //           name: l["name"],
  //           curvative: getRandomInt(20,500)/1000
  //         }]
  //     })
  // }, [data])

  // const { loading: loadingLinks, data: dataNew } = useSubscription(CYBERLINK_SUBSCRIPTION, {
  //   onSubscriptionData: handleNewLink
  // });

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Loading />
        <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
          receiving data
        </div>
      </div>
    );
  }

  let pocket;
  if (localStorage.getItem('pocket') != null) {
    const localStoragePocketData = JSON.parse(localStorage.getItem('pocket'));
    const keyPocket = Object.keys(localStoragePocketData)[0];
    pocket = localStoragePocketData[keyPocket].cyber.bech32;
  }

  return (
    <div>
      {hasLoaded && (
        <div
          style={{
            width: '100%',
            height: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'absolute',
            zIndex: 2,
          }}
        >
          <Loading />
          <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
            rendering brain
          </div>
        </div>
      )}
      <ForceGraph3D
        graphData={data}
        ref={fgRef}
        showNavInfo
        backgroundColor="#000000"
        warmupTicks={420}
        cooldownTicks={0}
        enableNodeDrag={false}
        enablePointerInteraction
        nodeLabel="id"
        nodeColor={() => 'rgba(0,100,235,1)'}
        nodeOpacity={1.0}
        nodeRelSize={8}
        linkColor={(link) =>
          // eslint-disable-next-line no-nested-ternary
          localStorage.getItem('pocket') != null
            ? // eslint-disable-next-line eqeqeq
              link.subject == pocket
              ? 'red'
              : 'rgba(9,255,13,1)'
            : 'rgba(9,255,13,1)'
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
