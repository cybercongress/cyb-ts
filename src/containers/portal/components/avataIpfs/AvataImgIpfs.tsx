import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import cx from 'classnames';

const getRoboHashImage = (addressCyber: string) =>
  `https://robohash.org/${addressCyber}`;

function AvataImgIpfs({ img = '', cidAvatar, addressCyber, ...props }) {
  const { fetchWithDetails } = useQueueIpfsContent();

  const [avatar, setAvatar] = useState<string | null>(null);
  const { data } = useQuery(
    ['getAvatar', cidAvatar],
    async () =>
      fetchWithDetails
        ? fetchWithDetails(cidAvatar, 'image').then(
            (details) => details?.content
          )
        : null,

    {
      enabled: Boolean(fetchWithDetails && cidAvatar),
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
      className={cx(styles.imgAvatar, props.className)}
      alt="img-avatar"
      src={avatarImage}
    />
  );
}

export default AvataImgIpfs;
