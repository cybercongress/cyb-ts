import { Pane } from '@cybercongress/gravity';
import { NoItems, Account } from '../../../components';

function CommunityTab({ data }) {
  if (Object.keys(data).length > 0) {
    const rowItem = Object.keys(data)
      .sort((a, b) => data[b].amount - data[a].amount)
      .map((key) => (
        <Account
          styleUser={{ flexDirection: 'column' }}
          sizeAvatar="80px"
          avatar
          key={key}
          address={key}
          trimAddressParam={[4, 3]}
        />
      ));

    return (
      <Pane marginX="auto" width="60%" marginY={25}>
        <Pane fontSize="18px">Community</Pane>
        <Pane
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(100px, 100px))"
          width="100%"
          gridGap="10px"
        >
          {rowItem}
        </Pane>
      </Pane>
    );
  }
  return <NoItems text="No cyberLinks" />;
}

export default CommunityTab;
