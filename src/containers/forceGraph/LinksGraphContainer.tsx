import { createPortal } from 'react-dom';
import { Loading } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import useCyberlinks from './useCyberlinks';
import { PORTAL_ID } from '../application/App';
import LinksGraph from './forceGraph';

type Props = {
  address?: string;
  toPortal?: boolean;
  size?: number;
};

function LinksGraphContainer({ address, toPortal, size }: Props) {
  const { data, loading } = useCyberlinks(address);

  const currentAddress = useAppSelector(selectCurrentAddress);

  const content = loading ? (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      <Loading />
      <p
        style={{
          color: '#fff',
          fontSize: 20,
          textAlign: 'center',
        }}
      >
        loading...
      </p>
    </div>
  ) : (
    <LinksGraph data={data} size={size} currentAddress={currentAddress} />
  );

  const portalEl = document.getElementById(PORTAL_ID);

  return toPortal ? portalEl && createPortal(content, portalEl) : content;
}

export default LinksGraphContainer;

// old code

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
