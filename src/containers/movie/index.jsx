import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Iframe from 'react-iframe';
import { Loading } from '../../components';

// const linkMovie =
//   'http://127.0.0.1:8080/ipfs/QmY37mCc1FuSMzpKaHoz5aDtJsz4gnJWG13Vrih8ifxXjS/';

const linkMovie =
  'https://gateway.ipfs.cybernode.ai/ipfs/QmUbH9J4tpz12ZrcAvHz7w8pMXpvm8qz4P25v8vFjo1gP3';

function Movie() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const redirect = () => {
    navigate(`/oracle`);
  };

  useEffect(() => {
    const handlerEventListener = (e) => {
      if (e.data === 'endStatusMovie') {
        redirect();
      }
    };
    window.addEventListener('message', handlerEventListener);
    return () => {
      window.removeEventListener('message', handlerEventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const iframeTag = document.querySelector('iframe');

    if (iframeTag) {
      iframeTag.addEventListener('load', () => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: 'calc(100vh - 70px)',
        position: 'fixed',
        top: '70px',
      }}
    >
      {loading && (
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
            rendering story
          </div>
        </div>
      )}
      <Iframe
        width="100%"
        height="100%"
        id="iframeCid"
        className="iframe-SearchItem"
        src={linkMovie}
      />
    </div>
  );
}

export default Movie;
