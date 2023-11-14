import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Account } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import {
  SliceState,
  selectCommunityPassports,
} from 'src/features/passport/passports.redux';
import { useAppSelector } from 'src/redux/hooks';
import TitleAction from './components/TitleAction/TitleAction';
import styles from './styles.module.scss';
import TotalCount from './components/TotalCount/TotalCount';

const TOP_AMOUNT = 5;

function SendAction() {
  const { friends } = useAppSelector(selectCommunityPassports);

  const totalCount = useMemo(() => {
    if (friends && Object.keys(friends).length) {
      return Object.keys(friends).length - TOP_AMOUNT;
    }
    return 0;
  }, [friends]);

  const renderItems = useMemo(() => {
    const sliceData: SliceState = Object.keys(friends)
      .slice(0, TOP_AMOUNT)
      .reduce((obj, key) => {
        return { ...obj, [key]: friends[key] };
      }, {});

    return Object.keys(sliceData).map((key) => {
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
    });
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
      <div className={styles.SendActionContentContainer}>
        {renderItems}
        {totalCount > 0 && <TotalCount value={totalCount} onlyValue />}
      </div>
    </Display>
  );
}

export default SendAction;
