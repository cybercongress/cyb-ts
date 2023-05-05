import { Link } from 'react-router-dom';
import { Account } from 'src/components';
import dateFormat from 'dateformat';
import { CreatorCyberLink } from 'src/types/cyberLink';

type Props = {
  creator: CreatorCyberLink;
};

function Creator({ creator }: Props) {
  return (
    <div>
      <Link to={`/network/bostrom/contract/${creator.address}`}>
        <Account
          styleUser={{ flexDirection: 'column' }}
          sizeAvatar="80px"
          avatar
          address={creator.address}
        />
      </Link>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {dateFormat(creator.timestamp, 'dd/mm/yyyy, HH:MM:ss')}
      </div>
    </div>
  );
}

export default Creator;
