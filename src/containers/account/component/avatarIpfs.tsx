import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import useIpfs from 'src/hooks/useIpfs';

import { getAvatar, getAvatarIpfs } from '../../../utils/search/utils';
import { PATTERN_CYBER, CYBER } from '../../../utils/config';

type AvatarIpfsProps = {
  addressCyber: string;
  width?: string;
  height?: string;
  showAddress?: boolean;
};

function AvatarIpfs({
  addressCyber = CYBER.BECH32_PREFIX_ACC_ADDR_CYBER,
  width = '80px',
  height = '80px',
  showAddress = false,
}: AvatarIpfsProps) {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const { node } = useIpfs();
  let trimAddress = '';
  if (addressCyber.length > 0) {
    trimAddress = addressCyber.replace(/cyber/g, '');
  }

  useEffect(() => {
    const fetchAvatar = async () => {
      const response = await getAvatar(addressCyber);
      if (response && response.total_count > 0) {
        const cidTo =
          response.txs[response.txs.length - 1].tx.value.msg[0].value.links[0]
            .to;

        const responseImg = await getAvatarIpfs(cidTo, node);
        setAvatar(responseImg);
      }
    };
    if (addressCyber.match(PATTERN_CYBER)) {
      fetchAvatar();
    }
  }, [addressCyber, node]);

  return (
    <Link to={`/network/bostrom/contract/${addressCyber}`}>
      <Pane display="flex" flexDirection="column" alignItems="center">
        <img
          style={{
            width,
            height,
            borderRadius: avatar ? '50%' : 'none',
            objectFit: 'cover',
          }}
          alt="img-avatar"
          src={avatar || `https://robohash.org/${addressCyber}`}
        />
        {showAddress && trimAddress.length > 6 && (
          <Pane>{`${trimAddress.slice(0, 3)}...${trimAddress.slice(-3)}`}</Pane>
        )}
      </Pane>
    </Link>
  );
}

export default AvatarIpfs;
