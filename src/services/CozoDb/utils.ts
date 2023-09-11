import { IPFSContent } from 'src/utils/ipfs/ipfs';

export const mapParticleToCozoEntity = (particle: IPFSContent): any => {
  const { cid, result, meta, textPreview } = particle;
  const { size, mime, type, blocks, sizeLocal } = meta;
  //   const isText = mime && mime.indexOf('text/plain') > -1;

  //   const text = isText
  //     ? uint8ArrayToAsciiString(await getResponseAsTextPreview(result))
  //         .replace(/"/g, '%20')
  //         .slice(0, 150)
  //     : '';

  return {
    cid,
    size,
    mime: mime || 'unknown',
    type,
    text: textPreview || '',
    sizeLocal: sizeLocal || -1,
    blocks: blocks || 0,
  };
};
