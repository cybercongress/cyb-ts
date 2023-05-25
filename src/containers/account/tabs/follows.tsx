import { Pane } from '@cybercongress/gravity';
import { NoItems, Account, ContainerGradientText } from '../../../components';
import { useGetCommunity } from '../hooks';
import useGetAddressTemp from '../hooks/useGetAddressTemp';
import styles from './Follows.module.scss';

type CommunityEntityProps = {
  items: string[];
  title: string;
  noItemsTitle: string;
};

function CommunityEntity({ items, title, noItemsTitle }: CommunityEntityProps) {
  return (
    <ContainerGradientText marginBottom="20px" className={styles.wrapper}>
      <header className={styles.header}>{title}</header>
      {items.length > 0 ? (
        <Pane
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(100px, 100px))"
          width="100%"
          gridGap="10px"
        >
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
        </Pane>
      ) : (
        <NoItems text={noItemsTitle} />
      )}
    </ContainerGradientText>
  );
}

function FollowsTab() {
  const address = useGetAddressTemp();

  const {
    community: { friends, followers, following },
  } = useGetCommunity(address);
  return (
    <Pane
      style={{
        display: 'grid',
        rowGap: '20px',
      }}
    >
      <CommunityEntity
        title="Friends"
        noItemsTitle="No Friends"
        items={friends}
      />
      <CommunityEntity
        title="Following"
        noItemsTitle="No Following"
        items={following}
      />
      <CommunityEntity
        title="Followers"
        noItemsTitle="No Followers"
        items={followers}
      />
    </Pane>
  );
}

export default FollowsTab;
