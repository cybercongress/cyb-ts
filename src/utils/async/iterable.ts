async function* arrayToAsyncIterable<T>(array: T[]): AsyncIterable<T> {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of array) {
    yield item;
  }
}

async function asyncIterableBatchProcessor<T, K>(
  items: AsyncIterable<T> | Iterable<T>,
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
  // process the rest
  if (batch.length > 0) {
    await batchProcess(batch);
  }
}

async function asyncIterableToArray<T>(asyncIterable: AsyncIterable<T>) {
  const resultArray = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of asyncIterable) {
    resultArray.push(item);
  }
  return resultArray;
}
// Create a helper function to create AsyncIterable from a list and iterate one by one
function createAsyncIterable<T>(data: T[]): AsyncIterable<T> {
  let index = 0;
  return {
    [Symbol.asyncIterator]() {
      return {
        next(): Promise<IteratorResult<T>> {
          if (index < data.length) {
            return Promise.resolve({ done: false, value: data[index++] });
          }
          return Promise.resolve({ done: true, value: undefined as any });
        },
      };
    },
  };
}

export {
  arrayToAsyncIterable,
  asyncIterableBatchProcessor,
  asyncIterableToArray,
  createAsyncIterable,
};
