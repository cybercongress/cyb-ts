import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import cx from 'classnames';
import { useQuery } from '@tanstack/react-query';
import styles from './styles.module.scss';

const getRoboHashImage = (addressCyber: string) =>
  `https://robohash.org/${addressCyber}`;

type Props = {
  cidAvatar?: string;
  img?: string;
  addressCyber?: string;
  className?: string;
};

function AvatarImgIpfs({
  img = '',
  cidAvatar,
  addressCyber,
  className,
  ...props
}: Props) {
  const { fetchWithDetails } = useQueueIpfsContent();

  const { data: avatar } = useQuery(
    ['getAvatar', cidAvatar],
    async () => {
      const details = await fetchWithDetails!(cidAvatar!, 'image');
      return details?.content || null;
    },
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
      src={avatarImage}
      className={cx(styles.imgAvatar, className)}
      alt="img-avatar"
    />
  );
}

export default AvatarImgIpfs;
