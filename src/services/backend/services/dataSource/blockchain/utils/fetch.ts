import { Transaction } from '../types';

export async function* fetchIterable<T>(
  fetchFunction: (
    url: string,
    id: string,
    timestamp: number,
    offset: number
  ) => Promise<T[]>,
  cyberServiceUrl: string,
  id: string,
  timestamp: number,
  types: Transaction['type'][] = []
): AsyncGenerator<T[], void, undefined> {
  let offset = 0;
  while (true) {
    const items = await fetchFunction(cyberServiceUrl, id, timestamp, offset);

    if (items.length === 0) {
      break;
    }

    yield items;

    offset += items.length;
  }
}
