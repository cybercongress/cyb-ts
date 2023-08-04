import { SliceState } from 'src/features/passport/passports.redux';
import { Citizenship } from 'src/types/citizenship';
import { Nullable } from 'src/types';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import { trimString } from 'src/utils/utils';
import styles from './styles.module.scss';

type DataItem = {
  nickname: string | undefined;
  cidAvatar: undefined | string;
  owner: string;
};

type PropsOptionItem = {
  data: DataItem;
};

type OnClickByNickname = (owner: string, nckname: string | undefined) => void;

type Props = {
  address: string;
  item: Nullable<Citizenship>;
  onClickByNickname: OnClickByNickname;
};

function OptionItem({ data }: PropsOptionItem) {
  const { nickname, owner, cidAvatar } = data;

  const ownerTrim = trimString(owner, 10, 3);

  return (
    <div className={styles.containerOptionItem}>
      <div className={styles.containerAvatarNickName}>
        <div className={styles.containerAvatar}>
          <AvataImgIpfs addressCyber={owner} cidAvatar={cidAvatar} />
        </div>
        <div className={styles.containerNickName}>{nickname || ownerTrim}</div>
      </div>
      <div className={styles.containerOwner}>{nickname && ownerTrim}</div>
    </div>
  );
}

function AccountInputOption({ address, item, onClickByNickname }: Props) {
  let owner = address;
  let nickname: string | undefined;
  let cidAvatar;

  if (item) {
    const { extension } = item;

    nickname = extension.nickname;
    owner = item.owner;
    cidAvatar = extension.avatar;
  }

  return (
    <button
      key={owner}
      onClick={() => onClickByNickname(owner, nickname)}
      type="button"
      className={styles.containerButtonOption}
    >
      <OptionItem data={{ nickname, cidAvatar, owner }} />
    </button>
  );
}

function AccountInputOptionList({
  data,
  onClickByNickname,
}: {
  data: SliceState;
  onClickByNickname: OnClickByNickname;
}) {
  return (
    <div className={styles.containerList}>
      {Object.keys(data).map((key) => (
        <AccountInputOption
          key={key}
          address={key}
          item={data[key]?.data}
          onClickByNickname={onClickByNickname}
        />
      ))}
    </div>
  );
}

export default AccountInputOptionList;
