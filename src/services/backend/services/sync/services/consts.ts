import {
  CYBER_LINK_TRANSACTION_TYPE,
  MSG_MULTI_SEND_TRANSACTION_TYPE,
  MSG_SEND_TRANSACTION_TYPE,
  Transaction,
} from '../../dataSource/blockchain/types';

export const PARTICLES_SYNC_INTERVAL = 60 * 1000; // 60 sec
export const MY_SYNC_INTERVAL = 60 * 1000; // 60 sec
export const MY_FRIENDS_SYNC_INTERVAL = 60 * 1000; // 60 sec
export const MY_FRIENDS_SYNC_WARMUP = 5 * 1000; // 60 sec
export const IPFS_SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const MAX_PARRALEL_TRANSACTIONS = 5;
export const MAX_PARRALEL_LINKS = 20;

export const SENSE_TRANSACTIONS = [
  MSG_SEND_TRANSACTION_TYPE,
  MSG_MULTI_SEND_TRANSACTION_TYPE,
  CYBER_LINK_TRANSACTION_TYPE,
] as Transaction['type'][];
