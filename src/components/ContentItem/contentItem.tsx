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
import { getResponseResult } from 'src/utils/ipfs/stream-utils';

import SearchItem from '../SearchItem/searchItem';
import { CYBER } from '../../utils/config';

import { getRankGrade } from '../../utils/search/utils';
import styles from './contentItem.module.scss';

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
    const rawData = await getResponseResult(content.result);
    const details = parseRawIpfsData(rawData, content.meta?.mime, cid);

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
  const [ipfsDataDetails, setIpfsDatDetails] =
    useState<IPFSContentDetails>(undefined);
  const { status, content, source } = useQueueIpfsContent(
    cid,
    item.rank,
    parentId
  );

  useEffect(() => {
    // TODO: cover case with content === 'availableDownload'
    if (status === 'completed') {
      getContentDetails(cid, content).then(setIpfsDatDetails);
    }
  }, [content, status, cid]);

  return (
    <Link className={className} to={`/ipfs/${cid}`}>
      {/* status !== 'completed' && */}
      {
        <div
          className={styles.contentLoadInfo}
        >{`source: ${source} mime: ${content?.meta?.mime} size: ${content?.meta?.size} local: ${content?.meta?.local} status: ${status} cid: ${cid}`}</div>
      }
      <SearchItem
        key={cid}
        textPreview={
          // NEED TO move out from here this code or encapsulate whole logic into SearchItem
          ipfsDataDetails?.type === 'text' && (
            <div className="container-text-SearchItem">
              <ReactMarkdown
                rehypePlugins={[rehypeSanitize]}
                remarkPlugins={[remarkGfm]}
              >
                {ipfsDataDetails?.text}
              </ReactMarkdown>
            </div>
          )
        }
        status={status}
        grade={
          item.rank
            ? getRankGrade(item.rank)
            : grade || { from: 'n/a', to: 'n/a', value: 'n/a' }
        }
      >
        {status !== 'completed' && <div>{cid}</div>}
        {ipfsDataDetails?.type === 'link' && (
          <div>{ipfsDataDetails.content}</div>
        )}
        {ipfsDataDetails?.type === 'image' && (
          <img
            style={{ width: '100%', paddingTop: 10 }}
            alt="img"
            src={ipfsDataDetails?.content}
          />
        )}
        {ipfsDataDetails?.type === 'pdf' && (
          <Iframe
            width="100%"
            height="400px"
            className="iframe-SearchItem"
            url={ipfsDataDetails?.content}
            // TODO: USE loaded content
            // url={`${CYBER.CYBER_GATEWAY}${ipfsDataDetails?.link}`}
          />
        )}
      </SearchItem>
    </Link>
  );
}

export default ContentItem;
