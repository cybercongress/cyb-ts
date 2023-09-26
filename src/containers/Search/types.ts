export type SearchItemType = {
  cid: string;
  rank?: string;
  grade?: string;
  timestamp?: string;
};

export enum LinksTypeFilter {
  to = 'to',
  all = 'all',
  from = 'from',
}

export enum SortBy {
  rank = 'rank',
  date = 'date',
  // not ready
  popular = 'popular',
  mine = 'mine',
}
