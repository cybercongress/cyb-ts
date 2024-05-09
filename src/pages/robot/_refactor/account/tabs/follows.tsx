import { Pane } from '@cybercongress/gravity';
import Loader2 from 'src/components/ui/Loader2';
import { useRobotContext } from 'src/pages/robot/robot.context';
import { NoItems, Account, ContainerGradient } from '../../../../../components';
import { useGetCommunity } from '../hooks';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { useAdviser } from 'src/features/adviser/context';
import { useEffect } from 'react';

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
  return (
    <ContainerGradient
      togglingDisable
      userStyleContent={{
        // overflowY: 'auto',
        minHeight: 260,
      }}
      title={title}
    >
      {loading ? (
        <Loader2 />
      ) : items.length > 0 ? (
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
    </ContainerGradient>
  );
}

function FollowsTab() {
  const { address, isOwner } = useRobotContext();
  const mainAccountCommunity = useSelector(
    (state: RootState) => state.backend.community
  );

  const communityHook = useGetCommunity(address, { skip: isOwner });

  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <>
        neurons surrounding <br /> trace the connections
      </>
    );
  }, [setAdviser]);

  const community = isOwner ? mainAccountCommunity : communityHook.community;
  const loading = isOwner
    ? {
        friends: false,
        following: false,
        followers: false,
      }
    : communityHook.loading;
  return (
    <Pane
      style={{
        display: 'grid',
        rowGap: 20,
      }}
    >
      <CommunityEntity
        title="Friends"
        loading={loading.friends}
        noItemsTitle="No Friends"
        items={community.friends}
      />
      <CommunityEntity
        title="Following"
        loading={loading.following}
        noItemsTitle="No Following"
        items={community.following}
      />
      <CommunityEntity
        title="Followers"
        loading={loading.followers}
        noItemsTitle="No Followers"
        items={community.followers}
      />
    </Pane>
  );
}

export default FollowsTab;
