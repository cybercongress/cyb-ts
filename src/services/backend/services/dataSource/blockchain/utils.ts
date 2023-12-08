export async function* fetchIterable<T>(
  fetchFunction: (
    url: string,
    id: string,
    timestamp: number,
    offset: number
  ) => Promise<T[]>,
  id: string,
  cyberIndexUrl: string,
  timestamp: number
): AsyncGenerator<T[], void, undefined> {
  let offset = 0;
  while (true) {
    const items = await fetchFunction(id, cyberIndexUrl, timestamp, offset);

    if (items.length === 0) {
      break;
    }

    yield items;

    offset += items.length;
  }
}
