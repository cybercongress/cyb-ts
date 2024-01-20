import { Transaction } from '../types';

export async function* fetchIterable<T>(
  fetchFunction: (
    url: string,
    id: string,
    timestamp: number,
    offset: number,
    types: Transaction['type'][]
  ) => Promise<T[]>,
  cyberIndexUrl: string,
  id: string,
  timestamp: number,
  types: Transaction['type'][] = []
): AsyncGenerator<T[], void, undefined> {
  let offset = 0;
  while (true) {
    const items = await fetchFunction(
      cyberIndexUrl,
      id,
      timestamp,
      offset,
      types
    );

    if (items.length === 0) {
      break;
    }

    yield items;

    offset += items.length;
  }
}
