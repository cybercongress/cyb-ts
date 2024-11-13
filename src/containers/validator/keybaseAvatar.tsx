import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { keybaseAvatar } from '../../utils/search/utils';

const img = require('../../image/logo-cyb-v3.svg');

function KeybaseAvatar({ identity }: { identity?: string }) {
  const { data } = useQuery({
    queryKey: ['KeybaseAvatar', identity],
    queryFn: () => keybaseAvatar(identity),
    enabled: Boolean(identity),
  });

  const imgKeyBase = useMemo(() => {
    if (data && data.them && data.them.length && data.them[0].pictures) {
      return data.them[0].pictures.primary.url;
    }
    return undefined;
  }, [data]);

  return (
    <img
      style={{
        width: '80px',
        height: '80px',
        borderRadius: imgKeyBase ? '50%' : 'none',
      }}
      alt="img-avatar"
      src={imgKeyBase || img}
    />
  );
}

export default KeybaseAvatar;
