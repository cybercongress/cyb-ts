import { useQuery } from '@tanstack/react-query';
import styles from './styles.module.scss';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import cx from 'classnames';

const getRoboHashImage = (addressCyber: string) =>
  `https://robohash.org/${addressCyber}`;

function AvatarImgIpfs({ img = '', cidAvatar, addressCyber, ...props }) {
  const { fetchWithDetails } = useQueueIpfsContent();

  const { data } = useQuery(
    ['getAvatar', cidAvatar],
    async () => {
      const response = await fetchWithDetails!(cidAvatar, 'image');
      return response?.content || null;
    },
    {
      enabled: Boolean(fetchWithDetails && cidAvatar),
      // staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
      retry: 0,
    }
  );

  const avatarImage =
    data ||
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

export default AvatarImgIpfs;
