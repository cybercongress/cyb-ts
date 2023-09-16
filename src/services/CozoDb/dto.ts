import { IPFSContent } from 'src/utils/ipfs/ipfs';

export const mapParticleToCozoEntity = (particle: IPFSContent): any => {
  const { cid, result, meta, textPreview } = particle;
  const { size, mime, type, blocks, sizeLocal } = meta;
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
