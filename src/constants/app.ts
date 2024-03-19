// export const CID_AVATAR = 'Qmf89bXkJH9jw4uaLkHmZkxQ51qGKfUPtAMxA8rTwBrmTs';
export const CID_TWEET = 'QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx';
export const CID_FOLLOW = 'QmPLSA5oPqYxgc8F7EwrM8WS9vKrr1zPoDniSRFh8HSrxx';

export const BECH32_PREFIX_ACC_ADDR_CYBER = 'bostrom';

export const PATTERN_CYBER = new RegExp(
  `^${BECH32_PREFIX_ACC_ADDR_CYBER}[a-zA-Z0-9]{39}$`,
  'g'
);
export const PATTERN_IPFS_HASH = /^Qm[a-zA-Z0-9]{44}$/g;
