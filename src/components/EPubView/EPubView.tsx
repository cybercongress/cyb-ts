import React, { CSSProperties, useMemo } from 'react';
import { ReactReader } from 'react-reader';
import useEPubLocation from 'src/hooks/useEPubLocation';

interface IProps {
  url: string;
  style?: CSSProperties;
}

function EPubView({ url, style }: IProps) {
  const [location, setLocation] = useEPubLocation(url);

  const currentStyle = useMemo(() => ({ height: '60vh', ...style }), [style]);

  return (
    <div style={currentStyle}>
      <ReactReader
        url={url}
        location={location ?? 0}
        locationChanged={(loc) => {
          setLocation(loc);
        }}
        epubInitOptions={{ openAs: 'epub' }}
      />
    </div>
  );
}

export default React.memo(EPubView);
