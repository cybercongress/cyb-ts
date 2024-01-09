import { EntryType } from 'src/services/CozoDb/types/entities';
import { NeuronAddress, ParticleCid } from 'src/types/base';

type SenseParticleMeta = {
  id: { text: string; mime: string };
  lastId: { text: string; mime: string };
};

type SenseUserMeta = {
  value: Object;
  memo?: string;
  type: string;
};

type SenseMeta = SenseParticleMeta | SenseUserMeta;

export type SenseResult = {
  entryType: EntryType;
  id: NeuronAddress | ParticleCid;
  unreadCont: number;
  timestampUpdate: number;
  timestampRead: number;
  lastId: NeuronAddress | ParticleCid;
  meta: SenseMeta;
};

export type SenseUnread = {
  entryType: EntryType;
  unread: number;
};
