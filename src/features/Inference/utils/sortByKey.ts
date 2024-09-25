import { InferenceItem, SortBy } from '../type';

const sortByKey = (data: InferenceItem[], sortBy: SortBy) => {
  if (!data) {
    return [];
  }

  switch (sortBy) {
    case SortBy.balance:
      return data.sort((a, b) => b.balance - a.balance);

    case SortBy.rank:
      return data.sort((a, b) => b.rank - a.rank);

    default:
      return data.sort((a, b) => b.inference - a.inference);
  }
};

export default sortByKey;
