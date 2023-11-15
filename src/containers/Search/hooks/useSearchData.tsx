import { LinksTypeFilter, SortBy } from '../types';
import useRankLinks from './useRankLinks';
import useLinksByDate from './useLinksByDate';

// const queryNull = '0';
// keywordHashNull = await getIpfsHash(queryNull);

const useSearchData = (
  hash: string,
  {
    sortBy = SortBy.rank,
    linksType = LinksTypeFilter.all,
  }: {
    sortBy?: SortBy;
    linksType?: LinksTypeFilter;
  }
) => {
  const linksByDate = useLinksByDate(hash, linksType, {
    skip: sortBy !== SortBy.date,
  });

  const rankLinks = useRankLinks(hash, linksType, {
    skip: sortBy !== SortBy.rank,
  });

  if (sortBy === SortBy.rank) {
    return rankLinks;
  }

  // if (sortBy === SortBy.date) {
  return linksByDate;
  // }
};

export default useSearchData;
