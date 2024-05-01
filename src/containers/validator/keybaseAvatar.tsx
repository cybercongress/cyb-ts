import { useState, useEffect } from 'react';
import { keybaseAvatar } from '../../utils/search/utils';

const img = require('../../image/logo-cyb-v3.svg');

function KeybaseAvatar({ identity }) {
  const [avatar, setAvatar] = useState(false);
  const [imgKeyBase, setImgKeyBase] = useState('');

  useEffect(() => {
    keybaseAvatar(identity).then((data) => {
      if (data.status.code > 0) {
        setAvatar(false);
      } else if (data.them.length > 0) {
        setImgKeyBase(data.them[0].pictures.primary.url);
        setAvatar(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <img
      style={{
        width: '80px',
        height: '80px',
        borderRadius: avatar ? '50%' : 'none',
      }}
      alt="img-avatar"
      src={avatar ? imgKeyBase : img}
    />
  );
}

export default KeybaseAvatar;
