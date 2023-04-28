import { Pane } from '@cybercongress/gravity';
import { NoItems, Account } from '../../../components';

type CommunityEntityProps = {
  items: string[];
  title: string;
  noItemsTitle: string;
};

function CommunityEntity({ items, title, noItemsTitle }: CommunityEntityProps) {
  return (
    <Pane marginBottom="20px">
      <Pane marginBottom="10px" fontSize="20px">
        {title}
      </Pane>
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
    </Pane>
  );
}

type FollowsTabProps = {
  community: {
    following: string[];
    followers: string[];
    friends: string[];
  };
};

function FollowsTab({
  community: { following, followers, friends },
}: FollowsTabProps) {
  return (
    <Pane className="contentItem">
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
