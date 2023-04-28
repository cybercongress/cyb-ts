import { Link } from 'react-router-dom';
import { InfoCard } from 'src/containers/portal/components';
import { routes } from 'src/routes';

function IPFSConnectError() {
  return (
    <div
      style={{
        width: '59%',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <Link to={routes.ipfs.path}>
        <InfoCard status="red">
          <div
            style={{
              textAlign: 'center',
              padding: '10px 50px 0px 50px',
              gap: 20,
              display: 'grid',
              color: '#fff',
            }}
          >
            <div style={{ fontSize: '28px' }}>
              Could not connect to the IPFS API
            </div>
            <div>
              <span style={{ color: '#36d6ae' }}>Go to ipfs page</span>
            </div>
          </div>
        </InfoCard>
      </Link>
    </div>
  );
}

export default IPFSConnectError;
