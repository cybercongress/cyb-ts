import { useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import { useQueryClient } from 'src/contexts/queryClient';
import Rank from '../Rank/rank';
import {
  timeSince,
  coinDecimals,
  exponentialToDecimal,
} from '../../utils/utils';
import { getRankGrade } from '../../utils/search/utils';
import ContentItem from '../ContentItem/contentItem';
import { useDevice } from 'src/contexts/device';

function TimeAgo({ timeAgoInMS }) {
  return (
    <Pane
      className="time-discussion rank-contentItem"
      position="absolute"
      right="0"
      fontSize={12}
      whiteSpace="nowrap"
      top="50%"
      transform="translate(0, -50%)"
      marginTop="-5px"
    >
      {timeSince(timeAgoInMS)} ago
    </Pane>
  );
}

const initialState = {
  rank: 'n/a',
  grade: { from: 'n/a', to: 'n/a', value: 'n/a' },
};

function SearchSnippet({ cid, data, onClickRank }) {
  const queryClient = useQueryClient();
  const [rankInfo, setRankInfo] = useState(initialState);
  const { isMobile: mobile } = useDevice();

  useEffect(() => {
    const getRank = async () => {
      if ((data.rank === undefined || data.rank === null) && queryClient) {
        const response = await queryClient.rank(cid);

        const rank = coinDecimals(parseFloat(response.rank));
        const rankData = {
          rank: exponentialToDecimal(rank.toPrecision(3)),
          grade: getRankGrade(rank),
        };
        setRankInfo(rankData);
      }
    };
    getRank();
  }, [data, queryClient, cid]);

  let timeAgoInMS = null;

  if (data.time) {
    const d = new Date();
    const time = Date.parse(d) - Date.parse(data.time);
    if (time > 0) {
      timeAgoInMS = time;
    }
  }
  if (data.timestamp) {
    const d = new Date();
    const time = Date.parse(d) - Date.parse(data.timestamp);
    if (time > 0) {
      timeAgoInMS = time;
    }
  }

  return (
    <Pane
      position="relative"
      className="hover-rank"
      display="flex"
      alignItems="center"
      marginBottom="-2px"
    >
      {!mobile && (
        <Pane className="time-discussion rank-contentItem" position="absolute">
          <Rank
            hash={cid}
            rank={rankInfo.rank}
            grade={rankInfo.grade}
            onClick={() => onClickRank(cid)}
          />
        </Pane>
      )}
      <ContentItem
        cid={cid}
        item={data}
        className="contentItem"
        grade={rankInfo.grade}
      />
      {timeAgoInMS !== null && <TimeAgo timeAgoInMS={timeAgoInMS} />}
    </Pane>
  );
}

export default SearchSnippet;
