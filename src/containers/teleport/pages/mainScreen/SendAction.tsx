import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import {
  SliceState,
  selectCommunityPassports,
} from 'src/features/passport/passports.redux';
import { useAppSelector } from 'src/redux/hooks';
import { trimString } from 'src/utils/utils';

function SendAction() {
  const { friends } = useAppSelector(selectCommunityPassports);

  const renderItems = useMemo(() => {
    const sliceData: SliceState = Object.keys(friends)
      .slice(0, 5)
      .reduce((obj, key) => {
        return { ...obj, [key]: friends[key] };
      }, {});

    return Object.keys(sliceData).map((key) => {
      const item = sliceData[key];
      let cidAvatar;
      let nickname: string | undefined;
      let owner = key;

      if (item?.data) {
        const { extension } = item.data;
        nickname = extension.nickname;
        owner = item.data.owner;
        cidAvatar = extension.avatar;
      }

      const ownerTrim = trimString(owner, 10, 3);

      return (
        <Link key={key} to={`send?recipient=${key}&token=boot`}>
          <div style={{ width: '50px', height: '50px' }}>
            <AvataImgIpfs addressCyber={owner} cidAvatar={cidAvatar} />
          </div>
          <div>{nickname || ownerTrim}</div>
        </Link>
      );
    });
  }, [friends]);

  return (
    <div>
      Send
      <br />
      connected: top 5 friends
      <br />
      <div>{renderItems}</div>
      <br />
      not connected: send
    </div>
  );
}

export default SendAction;
