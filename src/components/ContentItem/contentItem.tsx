// TODO: refactor needed
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { $TsFixMe } from 'src/types/tsfix';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { IpfsContentType } from 'src/utils/ipfs/ipfs';
import { IPFSContentDetails } from 'src/services/ipfs/ipfs';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';

import SearchItem from '../SearchItem/searchItem';

import { getRankGrade } from '../../utils/search/utils';
import ContentIpfs from '../contentIpfs/contentIpfs';

type ContentItemProps = {
  item: $TsFixMe;
  cid: string;
  grade?: $TsFixMe;
  className?: string;
  parent?: string;
  setType?: (type: IpfsContentType) => void;
};

function ContentItem({
  item,
  cid,
  grade,
  linkType,
  parent: parentId,
  setType,
  className,
}: ContentItemProps): JSX.Element {
  const [details, setDetails] = useState<IPFSContentDetails>(undefined);
  const { status, content, fetchParticle } = useQueueIpfsContent(parentId);

  useEffect(() => {
    fetchParticle && (async () => fetchParticle(cid, item?.rank))();
  }, [cid, item?.rank, fetchParticle]);

  useEffect(() => {
    (async () => {
      const details = await parseArrayLikeToDetails(
        content,
        cid
        // (progress: number) => console.log(`${cid} progress: ${progress}`)
      );
      setDetails(details);
      details?.type && setType && setType(details?.type);
    })();
  }, [content, cid]); //TODO: REFACT - setType rise infinite loop

  return (
    <Link className={className} style={{ color: '#fff' }} to={`/ipfs/${cid}`}>
      <SearchItem
        key={cid}
        linkType={linkType}
        status={status}
        grade={
          item?.rank
            ? getRankGrade(item.rank)
            : grade || { from: 'n/a', to: 'n/a', value: 'n/a' }
        }
      >
        <ContentIpfs details={details} content={content} cid={cid} search />
      </SearchItem>
    </Link>
  );
}

export default ContentItem;
