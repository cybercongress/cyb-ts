// TODO: refactor needed
import React from 'react';
import { Link } from 'react-router-dom';
import { $TsFixMe } from 'src/types/tsfix';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { IPFSContentDetails, IPFSContentMaybe } from 'src/utils/ipfs/ipfs';
import { parseRawIpfsData } from 'src/utils/ipfs/content-utils';

import SearchItem from '../SearchItem/searchItem';

import { getRankGrade } from '../../utils/search/utils';
import ContentIpfs from '../contentIpfs/contentIpfs';

type ContentItemProps = {
  item: $TsFixMe;
  cid: string;
  grade?: $TsFixMe;
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

  return (
    <Link className={className} style={{ color: '#fff' }} to={`/ipfs/${cid}`}>
      <SearchItem
        key={cid}
        status={status}
        grade={
          item.rank
            ? getRankGrade(item.rank)
            : grade || { from: 'n/a', to: 'n/a', value: 'n/a' }
        }
      >
        <ContentIpfs status={status} content={content} cid={cid} search />
      </SearchItem>
    </Link>
  );
}

export default ContentItem;
