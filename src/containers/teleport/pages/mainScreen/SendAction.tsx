import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Account } from 'src/components';
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
      return (
        <Link key={key} to={`send?recipient=${key}&token=boot`}>
          <Account
            address={key}
            avatar
            sizeAvatar="50px"
            styleUser={{ flexDirection: 'column' }}
          />
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
      <div style={{ display: 'flex', gap: '20px' }}>{renderItems}</div>
      <br />
      not connected: send
    </div>
  );
}

export default SendAction;
