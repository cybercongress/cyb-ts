import { Link } from 'react-router-dom';
import { Account } from 'src/components';
import dateFormat from 'dateformat';

function Creator({ creator }) {
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
      {creator.timestamp.length > 0 && (
        <div>{dateFormat(creator.timestamp, 'dd/mm/yyyy, HH:MM:ss')}</div>
      )}
    </div>
  );
}

export default Creator;
