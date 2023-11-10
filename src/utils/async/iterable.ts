async function* arrayToAsyncIterable<T>(array: T[]): AsyncIterable<T> {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of array) {
    yield item;
  }
}

async function asyncIterableBatchProcessor<T, K>(
  items: AsyncIterable<T>,
  batchProcess: (arg: T[]) => Promise<K>,
  batchSize = 10
): Promise<void> {
  let batch = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of items) {
    batch.push(item);
    if (batch.length === batchSize) {
      await batchProcess(batch);
      batch = [];
    }
  }
}

export { arrayToAsyncIterable, asyncIterableBatchProcessor };
