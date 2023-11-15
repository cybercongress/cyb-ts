export enum LinksTypeFilter {
  to = 'to',
  all = 'all',
  from = 'from',
}

export type SearchItem = {
  cid: string;
  rank?: string;
  grade?: string;
  timestamp?: string;
  type?: LinksTypeFilter;
};

export enum SortBy {
  rank = 'rank',
  date = 'date',
  // not ready
  popular = 'popular',
  mine = 'mine',
}
