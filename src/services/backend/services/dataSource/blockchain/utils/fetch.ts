// eslint-disable-next-line import/prefer-default-export
export async function* fetchIterable<T, P>(
  fetchFunction: (params: P & { offset: number }) => Promise<T[]>,
  params: P
): AsyncGenerator<T[], void, undefined> {
  let offset = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const items = await fetchFunction({ ...params, offset });

    if (items.length === 0) {
      break;
    }

    yield items;

    offset += items.length;
  }
}
