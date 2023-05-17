import { CID } from 'multiformats/cid';

export const isCID = (cid: string): boolean => {
  try {
    return CID.parse(cid).version === 0;
  } catch {
    return false;
  }
};
