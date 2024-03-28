import { createPortal } from 'react-dom';
import { Loading } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import useCyberlinks from './useCyberlinks';
import { PORTAL_ID } from '../../../containers/application/App';
import LinksGraph from './CyberlinksGraph';

type Props = {
  address?: string;
  toPortal?: boolean;
  size?: number;
  limit?: number;
  data?: any;
};

function CyberlinksGraphContainer({
  address,
  toPortal,
  size,
  limit,
  data,
}: Props) {
  const { data: fetchData, loading } = useCyberlinks(
    { address },
    {
      limit,
      skip: !!data,
    }
  );

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
    <LinksGraph
      data={data || fetchData}
      size={size}
      currentAddress={currentAddress}
    />
  );

  const portalEl = document.getElementById(PORTAL_ID);

  return toPortal ? portalEl && createPortal(content, portalEl) : content;
}

export default CyberlinksGraphContainer;
