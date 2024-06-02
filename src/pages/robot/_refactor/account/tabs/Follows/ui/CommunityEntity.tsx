import Loader2 from 'src/components/ui/Loader2';
import { Account, DisplayTitle, NoItems } from 'src/components';
import styles from './CommunityEntity.module.scss';

type CommunityEntityProps = {
  items: string[];
  title: string;
  loading?: boolean;
  noItemsTitle: string;
};

function CommunityEntity({
  items,
  title,
  noItemsTitle,
  loading,
}: CommunityEntityProps) {
  if (loading) {
    return <Loader2 />;
  }

  if (items.length > 0) {
    return (
      <div className={styles.wrapper}>
        <DisplayTitle title={title} />

        <div className={styles.containerItem}>
          {items.map((item) => (
            <Account
              styleUser={{ flexDirection: 'column' }}
              sizeAvatar="80px"
              avatar
              address={item}
              key={`community_${title}_${item}`}
              trimAddressParam={[4, 3]}
            />
          ))}
        </div>
      </div>
    );
  }
  return <NoItems text={noItemsTitle} />;
}

export default CommunityEntity;
