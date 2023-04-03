import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useIpfs from 'src/hooks/useIpfs';
import { CYBER } from '../../../../utils/config';
import { checkIpfsState } from '../../../../utils/utils-ipfs';
import { getAvatarIpfs } from '../../../../utils/search/utils';
import styles from './styles.scss';

function AvataImgIpfs({ img, cidAvatar, addressCyber, ...props }) {
  const { node } = useIpfs();
  const [avatar, setAvatar] = useState(null);
  const { data } = useQuery(
    ['getAvatar', cidAvatar],
    async () => {
      const responseImg = await getAvatarIpfs(cidAvatar, node);
      if (responseImg && responseImg !== null) {
        return responseImg;
      }
      return null;
    },
    {
      enabled: Boolean(node && cidAvatar),
    }
  );

  useEffect(() => {
    if (data !== undefined && data !== null) {
      if (data === 'availableDownload') {
        const { userGateway } = checkIpfsState();
        let urlGateway = CYBER.CYBER_GATEWAY;

        if (userGateway !== null) {
          urlGateway = userGateway;
        }
        setAvatar(`${urlGateway}/ipfs/${cidAvatar}`);
      } else {
        setAvatar(data);
      }
    } else {
      setAvatar(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (avatar !== null) {
    return (
      <img
        {...props}
        className={styles.imgAvatar}
        alt="img-avatar"
        src={avatar}
      />
    );
  }

  if (addressCyber !== null) {
    return (
      <img
        {...props}
        className={styles.imgAvatar}
        alt="img-avatar"
        src={`https://robohash.org/${addressCyber}`}
      />
    );
  }

  if (img) {
    return (
      <img {...props} className={styles.imgAvatar} alt="img-avatar" src={img} />
    );
  }

  return (
    <img
      {...props}
      className={styles.imgAvatar}
      alt="img-avatar"
      src="https://robohash.org/null"
    />
  );
}

export default AvataImgIpfs;
