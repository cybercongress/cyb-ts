// TODO: refactor needed
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { $TsFixMe } from 'src/types/tsfix';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';

import SearchItem from '../SearchItem/searchItem';

import { getRankGrade } from '../../utils/search/utils';
import ContentIpfsViewer from '../contentIpfs/ContentIpfsViewer/ContentIpfsViewer';
import ContentIpfs from '../contentIpfs/contentIpfs';
import ParticleItem from '../contentIpfs/ParticleItem/ParticleItem';
import { StatusType } from '../SearchItem/status';

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

  const itemGrade = useMemo(
    () =>
      item.rank
        ? getRankGrade(item.rank)
        : grade || { from: 'n/a', to: 'n/a', value: 'n/a' },
    [item.rank, grade]
  );

  const isParticle = content?.contentType === 'particle' && content?.result;

  return (
    <Link
      className={className}
      style={{ color: '#fff' }}
      to={`/ipfs/${itemCid}`}
    >
      <SearchItem key={itemCid} status={status} grade={itemGrade}>
        {!isParticle && (
          <ContentIpfs content={content} status={status} cid={cid} search />
        )}

        {isParticle && (
          <ParticleItem
            content={content!.result}
            options={{ parentId, rank: item.rank }}
            search
            onCidChange={setItemCid}
          />
        )}
      </SearchItem>
    </Link>
  );
}

export default ContentItem;
