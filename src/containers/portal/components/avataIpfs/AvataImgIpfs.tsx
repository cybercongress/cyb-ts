import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

const getRoboHashImage = (addressCyber: string) =>
  `https://robohash.org/${addressCyber}`;

function AvatarImgIpfs({ img = '', cidAvatar, addressCyber, ...props }) {
  const { fetchWithDetails } = useQueueIpfsContent();
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!fetchWithDetails || !cidAvatar) {
      return;
    }

    fetchWithDetails(cidAvatar, 'image').then((value) => {
      setAvatar(value?.content);
    });
  }, [fetchWithDetails, cidAvatar]);

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

export default AvatarImgIpfs;
