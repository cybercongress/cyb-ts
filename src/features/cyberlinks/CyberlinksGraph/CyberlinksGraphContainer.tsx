import { createPortal } from 'react-dom';
import { Loading } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { Stars } from 'src/containers/portal/components';
import ErrorBoundary from 'src/components/ErrorBoundary/ErrorBoundary';
import { useEffect } from 'react';
import useCyberlinks from './useCyberlinks';
import { PORTAL_ID } from '../../../containers/application/App';
import GraphNew from '../GraphNew/GraphNew';
import CyberlinksGraph from './CyberlinksGraph';

enum Types {
  '3d' = '3d',
  '2d' = '2d',
}

type Props = {
  address?: string;
  toPortal?: boolean;
  size?: number;
  limit?: number | false;
  data?: any;
  type?: Types;

  // temp
  minVersion?: boolean;
};

function CyberlinksGraphContainer({
  address,
  toPortal,
  size,
  limit,
  data,
  minVersion,
  type = Types['2d'],
}: Props) {
  const { data: fetchData, loading } = useCyberlinks(
    { address },
    {
      limit,
      skip: !!data,
    }
  );

  const currentAddress = useAppSelector(selectCurrentAddress);

  const Comp = type === Types['2d'] ? GraphNew : CyberlinksGraph;

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
    <>
      {!minVersion && <Stars />}

      <ErrorBoundary fallback={<GraphRenderFallbackError />}>
        <Comp
          data={data || fetchData}
          size={size}
          minVersion={minVersion}
          currentAddress={currentAddress}
        />
      </ErrorBoundary>
    </>
  );

  const portalEl = document.getElementById(PORTAL_ID);

  console.log('CyberlinksGraphContainer', { data, fetchData });

  return toPortal ? portalEl && createPortal(content, portalEl) : content;
}

export default CyberlinksGraphContainer;

function GraphRenderFallbackError() {
  useEffect(() => {
    alert('Graph render error');
  }, []);
  return <div>Graph render error</div>;
}
