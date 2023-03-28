import React from 'react';
import { NoItems, SearchSnippet } from '../../../components';

function timeSince(timeMS) {
  const seconds = Math.floor(timeMS / 1000);

  if (seconds === 0) {
    return 'now';
  }

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
}

function FeedsTab({ data, mobile, nodeIpfs }) {
  const onClickRank = () => {};
  if (data && data.length > 0) {
    const d = new Date();
    return (
      <div className="container-contentItem" style={{ width: '100%' }}>
        {data
          .sort((a, b) => {
            const x = Date.parse(a.timestamp);
            const y = Date.parse(b.timestamp);
            return y - x;
          })
          .map((item, i) => {
            const cid = item.tx.value.msg[0].value.links[0].to;
            let timeAgoInMS = 0;
            const time = Date.parse(d) - Date.parse(item.timestamp);
            if (time > 0) {
              timeAgoInMS = time;
            }
            return (
              <SearchSnippet
                cid={cid}
                data={item}
                mobile={mobile}
                node={nodeIpfs}
                onClickRank={onClickRank}
              />
            );
          })}
      </div>
    );
  }
  return (
    <div className="container-contentItem">
      <NoItems text="No feeds" />
    </div>
  );
}

export default FeedsTab;
