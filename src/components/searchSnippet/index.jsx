import React, { useEffect, useState, useContext } from 'react';
import { Pane } from '@cybercongress/gravity';
import { AppContext } from '../../context';
import Rank from '../Rank/rank';
import {
  timeSince,
  coinDecimals,
  exponentialToDecimal,
} from '../../utils/utils';
import { getRankGrade } from '../../utils/search/utils';
import ContentItem from '../../containers/ipfs/contentItem';

const TimeAgo = ({ timeAgoInMS }) => (
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

const initialState = {
  rank: 'n/a',
  grade: { from: 'n/a', to: 'n/a', value: 'n/a' },
};

function SearchSnippet({ cid, data, mobile, node, onClickRank }) {
  const { jsCyber } = useContext(AppContext);
  const [rankInfo, setRankInfo] = useState(initialState);

  useEffect(() => {
    const getRank = async () => {
      if ((data.rank === undefined || data.rank === null) && jsCyber !== null) {
        const response = await jsCyber.rank(cid);

        const rank = coinDecimals(parseFloat(response.rank));
        const rankData = {
          rank: exponentialToDecimal(rank.toPrecision(3)),
          grade: getRankGrade(rank),
        };
        setRankInfo(rankData);
      }
    };
    getRank();
  }, [data, jsCyber, cid]);

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
      marginBottom="10px"
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
        nodeIpfs={node}
        cid={cid}
        item={data}
        className="contentItem"
        rank={rankInfo.rank}
        grade={rankInfo.grade}
      />
      {timeAgoInMS !== null && <TimeAgo timeAgoInMS={timeAgoInMS} />}
    </Pane>
  );
}

export default SearchSnippet;
