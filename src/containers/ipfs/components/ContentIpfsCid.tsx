import { QueueItemStatus } from 'src/services/QueueManager/QueueManager';
import ComponentLoader from '../../../features/ipfs/ipfsSettings/ipfsComponents/ipfsLoader';

type Props = {
  loading?: boolean;
  statusFetching?: string;
  status?: QueueItemStatus;
};

function ContentIpfsCid({ loading, statusFetching, status }: Props) {
  // const loading = dataGetIpfsContent.loading;

  if (loading) {
    return (
      <div
        style={{
          // TODO: Avoid inline styles
          width: '100%',
          // height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginBottom: '50px',
        }}
      >
        <ComponentLoader style={{ width: '100px', margin: '30px auto' }} />
        {statusFetching && (
          <div style={{ fontSize: '20px' }}>{statusFetching}</div>
        )}
      </div>
    );
  }

  if (!loading && ['error', 'timeout'].includes(status)) {
    return (
      <div
        style={{
          width: '100%',
          // height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginBottom: '50px',
        }}
      >
        <div style={{ fontSize: '20px' }}>IPFS content is not available</div>
      </div>
    );
  }

  return null;
}

export default ContentIpfsCid;
