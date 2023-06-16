// TODO: refactor needed
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { $TsFixMe } from 'src/types/tsfix';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import SearchItem from '../SearchItem/searchItem';

import { getRankGrade } from '../../utils/search/utils';
import ContentIpfs from '../contentIpfs/contentIpfs';

type ContentItemProps = {
  item: $TsFixMe;
  cid: string;
  grade?: number;
  className?: string;
  parent?: string;
};

function ContentItem({
  item,
  cid,
  grade,
  parent: parentId,
  className,
}: ContentItemProps): JSX.Element {
  const { status, content } = useQueueIpfsContent(cid, item.rank, parentId);

  const [itemCid, setItemCid] = useState(cid);
  useEffect(() => {
    if (status === 'completed' && content?.cid) {
      setItemCid(content?.cid);
    }
  }, [status, content]);

  const itemGrade = useMemo(
    () =>
      item.rank
        ? getRankGrade(item.rank)
        : grade || { from: 'n/a', to: 'n/a', value: 'n/a' },
    [item.rank, grade]
  );

  return (
    <Link
      className={className}
      style={{ color: '#fff' }}
      to={`/ipfs/${itemCid}`}
    >
      <SearchItem key={itemCid} status={status} grade={itemGrade}>
        <ContentIpfs content={content} status={status} cid={itemCid} search />
      </SearchItem>
    </Link>
  );
}

export default ContentItem;
