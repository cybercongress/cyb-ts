import { useMemo } from 'react';
import { Link, createSearchParams } from 'react-router-dom';
import { Account } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import { selectCommunityPassports } from 'src/features/passport/passports.redux';
import { useAppSelector } from 'src/redux/hooks';
import { BASE_DENOM } from 'src/constants/config';
import TitleAction from '../TitleAction/TitleAction';
import styles from './SendAction.module.scss';
import TotalCount from '../TotalCount/TotalCount';

const TOP_AMOUNT = 5;

// cicada, mcmerrit, cyberacademy, jooy, cybercongress
const topCreator = [
  'bostrom1qjf43tsdhzfk5apchznuheqf6sux0wwmt4q4qq',
  'bostrom122zt392tg6hperkmsrj20hyg9duzdxhz233f3g',
  'bostrom1679yrs8dmska7wcsawgy2m25kwucm3z0hwr74y',
  'bostrom1k7nssnnvxezpp4una7lvk6j53895vadpqe6jh6',
  'bostrom1xszmhkfjs3s00z2nvtn7evqxw3dtus6yr8e4pw',
];

function SendAction() {
  const { friends } = useAppSelector(selectCommunityPassports);

  const totalCount = useMemo(() => {
    if (friends && Object.keys(friends).length) {
      return Object.keys(friends).length - TOP_AMOUNT;
    }
    return 0;
  }, [friends]);

  const renderItems = useMemo(() => {
    const sliceData: string[] = Object.keys(friends)
      .slice(0, TOP_AMOUNT)
      .reduce((arr: string[], key: string) => {
        return [...arr, key];
      }, []);

    const renderData = sliceData.length > 0 ? sliceData : topCreator;

    return renderData.map((key) => {
      return (
        <Link
          key={key}
          to={{
            pathname: 'send',
            search: createSearchParams({
              recipient: key,
              token: BASE_DENOM,
            }).toString(),
          }}
        >
          <Account
            address={key}
            avatar
            onlyAvatar
            sizeAvatar="45px"
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
          to="send"
          subTitle="messages with tokens to friends and aliens"
        />
      }
    >
      <div className={styles.container}>
        {renderItems}
        {totalCount > 0 && <TotalCount value={totalCount} to="send" />}
      </div>
    </Display>
  );
}

export default SendAction;
