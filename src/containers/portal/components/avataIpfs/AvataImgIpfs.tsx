import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useIpfs } from 'src/contexts/ipfs';
import { getAvatarIpfs } from '../../../../utils/search/utils';
import styles from './styles.scss';

const getRoboHashImage = (addressCyber: string) =>
  `https://robohash.org/${addressCyber}`;

function AvataImgIpfs({ img = '', cidAvatar, addressCyber, ...props }) {
  const { node } = useIpfs();
  const [avatar, setAvatar] = useState<string | null>(null);
  const { data } = useQuery(
    ['getAvatar', cidAvatar],
    async () => {
      return getAvatarIpfs(cidAvatar, node);
    },
    {
      enabled: Boolean(node && cidAvatar),
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
      retry: 0,
    }
  );

  useEffect(() => {
    if (!data) {
      setAvatar(null);
    } else {
      setAvatar(data);
    }
  }, [data]);

  const avatarImage =
    avatar ||
    (addressCyber && getRoboHashImage(addressCyber)) ||
    img ||
    getRoboHashImage('null');

  return (
    <img
      {...props}
      className={styles.imgAvatar}
      alt="img-avatar"
      src={avatarImage}
    />
  );
}

export default AvataImgIpfs;
