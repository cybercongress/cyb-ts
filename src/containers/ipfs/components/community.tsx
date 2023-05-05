import { Pane } from '@cybercongress/gravity';
import { NoItems, Account } from '../../../components';

function Community({ community }) {
  if (community && community.length > 0) {
    const rowItem = community.map((key: string, index: number) => (
      <Account
        styleUser={{ flexDirection: 'column' }}
        sizeAvatar="80px"
        avatar
        key={`${key}_${index}`}
        address={key}
        trimAddressParam={[4, 3]}
      />
    ));

    return (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(100px, 100px))"
        width="100%"
        gridGap="10px"
      >
        {rowItem}
      </Pane>
    );
  }
  return <NoItems text="No community" />;
}

export default Community;
