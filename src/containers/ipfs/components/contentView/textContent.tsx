import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import { useEffect, useState } from 'react';
import { encodeSlash } from 'src/utils/utils';
import { getIpfsHash } from 'src/utils/search/utils';

import { useBackend } from 'src/contexts/backend';

function TextContent({ text }: { text: string }) {
  const [cid, setCid] = useState<string>('');

  const { ipfsNode } = useBackend();

  useEffect(() => {
    (async () => {
      const cidFromQuery = (await getIpfsHash(encodeSlash(text))) as string;
      await ipfsNode?.addContent(text);
      setCid(cidFromQuery);
    })();
  }, [text, ipfsNode]);

  return (
    <ContentIpfs
      details={{
        type: 'text',
        content: text,
        cid,
        gateway: false,
      }}
      cid={cid}
    />
  );
}

export default TextContent;
