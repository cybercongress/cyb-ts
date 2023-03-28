import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAvatarIpfs } from '../../../../utils/search/utils';
import styles from './styles.scss';

function AvataImgIpfs({ node, img, cidAvatar, addressCyber, ...props }) {
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
      setAvatar(data);
    } else {
      setAvatar(null);
    }
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

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(AvataImgIpfs);
