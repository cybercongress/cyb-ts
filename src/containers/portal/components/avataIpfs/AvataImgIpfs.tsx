import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useIpfs from 'src/hooks/useIpfs';
import { CYBER } from '../../../../utils/config';
import { getIpfsUserGatewanAndNodeType } from '../../../../utils/ipfs/utils-ipfs';
import { getAvatarIpfs } from '../../../../utils/search/utils';
import styles from './styles.scss';

const getRoboHashImage = (addressCyber: string) =>
  `https://robohash.org/${addressCyber}`;

function AvataImgIpfs({ img = '', cidAvatar, addressCyber, ...props }) {
  const { node } = useIpfs();
  const [avatar, setAvatar] = useState<string | null>(null);
  const { data } = useQuery(
    ['getAvatar', cidAvatar],
    async () => getAvatarIpfs(cidAvatar, node),
    {
      enabled: Boolean(node && cidAvatar),
    }
  );

  useEffect(() => {
    if (data) {
      if (data === 'availableDownload') {
        const { userGateway } = getIpfsUserGatewanAndNodeType();
        const urlGateway = userGateway || CYBER.CYBER_GATEWAY;
        setAvatar(`${urlGateway}/ipfs/${cidAvatar}`);
      } else {
        setAvatar(data);
      }
    } else {
      setAvatar(null);
    }
  }, [data, cidAvatar]);

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
