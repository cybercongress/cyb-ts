import { IPFSContentMaybe, IpfsContentSource } from 'src/utils/ipfs/ipfs';
import styles from './DebugContentInfo.module.scss';

function DebugContentInfo({
  cid,
  source,
  content,
  status,
}: {
  cid: string;
  source: IpfsContentSource | undefined;
  content: IPFSContentMaybe;
  status: string | undefined;
}) {
  const meta = content ? content.meta : undefined;
  const measurementInfo =
    source !== 'db'
      ? ` stats(ms): ${meta?.statsTime} cat(ms): ${meta?.catTime} pin(ms): ${meta?.pinTime}`
      : '';

  return (
    <div
      className={styles.contentLoadInfo}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await navigator.clipboard.writeText(cid);
      }}
    >
      <div>{`source: ${source} type: ${content?.contentType}  status: ${status} cid: ${cid}`}</div>
      <div>{`blocks: ${meta?.blocks} mime: ${meta?.mime} size: ${meta?.size} local: ${meta?.local}`}</div>
      {measurementInfo && <div>{measurementInfo}</div>}
    </div>
  );
}

export default DebugContentInfo;
