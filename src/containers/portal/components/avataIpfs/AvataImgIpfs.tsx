import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import cx from 'classnames';
import { useQuery } from '@tanstack/react-query';
import styles from './styles.module.scss';

const getRoboHashImage = (addressCyber: string) =>
  `https://robohash.org/${addressCyber}`;

function AvataImgIpfs({ img = '', cidAvatar, addressCyber, ...props }) {
  const { fetchWithDetails } = useQueueIpfsContent();

  const { data: avatar } = useQuery(
    ['getAvatar', cidAvatar],
    () =>
      fetchWithDetails!(cidAvatar, 'image').then((details) => {
        return details?.content;
      }),

    {
      enabled: Boolean(fetchWithDetails && cidAvatar),
    }
  );

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
