// TODO: refactor needed
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { $TsFixMe } from 'src/types/tsfix';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { IPFSContentDetails, IPFSContentMaybe } from 'src/utils/ipfs/ipfs';
import { parseRawIpfsData } from 'src/utils/ipfs/content-utils';

import SearchItem from '../SearchItem/searchItem';
import { CYBER } from '../../utils/config';

import { getRankGrade } from '../../utils/search/utils';
import styles from './contentItem.module.scss';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import ContentIpfs from '../contentIpfs/contentIpfs';

type ContentItemProps = {
  item: $TsFixMe;
  cid: string;
  grade?: $TsFixMe;
  className?: string;
  parent?: string;
};

const getContentDetails = async (
  cid: string,
  content: IPFSContentMaybe
): Promise<IPFSContentDetails> => {
  if (content?.result) {
    const details = await parseRawIpfsData(
      content.result,
      content.meta?.mime,
      cid
      // (progress: number) => console.log(`${cid} progress: ${progress}`)
    );

    return details;
  }
  return undefined;
};

function ContentItem({
  item,
  cid,
  grade,
  parent: parentId,
  className,
}: ContentItemProps): JSX.Element {
  // const [ipfsDataDetails, setIpfsDatDetails] =
  //   useState<IPFSContentDetails>(undefined);
  const { status, content, source } = useQueueIpfsContent(
    cid,
    item.rank,
    parentId
  );

  // useEffect(() => {
  //   // TODO: cover case with content === 'availableDownload'
  //   if (status === 'completed') {
  //     getContentDetails(cid, content).then(setIpfsDatDetails);
  //   }
  // }, [content, status, cid]);

  return (
    <Link className={className} to={`/ipfs/${cid}`}>
      {/* status !== 'completed' && */}
      <div
        className={styles.contentLoadInfo}
      >{`source: ${source} mime: ${content?.meta?.mime} size: ${content?.meta?.size} local: ${content?.meta?.local} status: ${status} cid: ${cid}`}</div>
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
