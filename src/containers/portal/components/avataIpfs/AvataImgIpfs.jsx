import React, { useEffect, useState } from 'react';
import { getAvatarIpfs } from '../../../../utils/search/utils';
import ContainerAvatar from './containerAvatar';

function AvataImgIpfs({ node, cidAvatar, addressCyber, ...props }) {
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState(true);

  useEffect(() => {
    const feachAvatar = async () => {
      if (node !== null && cidAvatar) {
        const responseImg = await getAvatarIpfs(cidAvatar, node);
        if (responseImg && responseImg !== null) {
          setAvatar(responseImg);
        }
      }
    };
    feachAvatar();
  }, [cidAvatar, node]);

  return (
    <img
      alt="img-avatar"
      src={avatar !== null ? avatar : `https://robohash.org/${addressCyber}`}
    />
  );
}

export default AvataImgIpfs;
