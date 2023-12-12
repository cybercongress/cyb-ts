import { EntryType } from 'src/services/CozoDb/types';
import { NeuronAddress, ParticleCid } from 'src/types/base';

export type SenseResult = {
  entryType: EntryType;
  id: NeuronAddress | ParticleCid;
  unreadCont: number;
  timestampUpdate: number;
  timestampRead: number;
  lastId: NeuronAddress | ParticleCid;
};

export type SenseUnread = {
  entryType: EntryType;
  unread: number;
};
