// eslint-disable-next-line import/prefer-default-export
export async function* fetchIterable<T, P>(
  fetchFunction: (url: string, params: P & { offset: number }) => Promise<T[]>,
  cyberServiceUrl: string,
  params: P
): AsyncGenerator<T[], void, undefined> {
  let offset = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const items = await fetchFunction(cyberServiceUrl, { ...params, offset });

    if (items.length === 0) {
      break;
    }

    yield items;

    offset += items.length;
  }
}
