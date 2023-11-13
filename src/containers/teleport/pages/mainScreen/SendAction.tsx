import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Account } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import {
  SliceState,
  selectCommunityPassports,
} from 'src/features/passport/passports.redux';
import { useAppSelector } from 'src/redux/hooks';
import { trimString } from 'src/utils/utils';
import TitleAction from './components/TitleAction/TitleAction';

function SendAction() {
  const { friends } = useAppSelector(selectCommunityPassports);

  const renderItems = useMemo(() => {
    const sliceData: SliceState = Object.keys(friends)
      .slice(0, 5)
      .reduce((obj, key) => {
        return { ...obj, [key]: friends[key] };
      }, {});

    return (
      <>
        {Object.keys(sliceData).map((key) => {
          return (
            <Link key={key} to={`send?recipient=${key}&token=boot`}>
              <Account
                address={key}
                avatar
                onlyAvatar
                sizeAvatar="50px"
                styleUser={{ flexDirection: 'column' }}
              />
            </Link>
          );
        })}
        <span>
          {Object.keys(friends).length > Object.keys(sliceData).length &&
            Object.keys(friends).length}
        </span>
      </>
    );
  }, [friends]);

  return (
    <Display
      title={
        <TitleAction
          title="Send"
          subTitle="messages with tokens to friends and aliens"
        />
      }
    >
      <div style={{ display: 'flex', gap: '20px' }}>{renderItems}</div>
    </Display>
  );
}

export default SendAction;
