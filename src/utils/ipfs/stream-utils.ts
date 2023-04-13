import { fileTypeFromBuffer } from 'file-type';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';

type ReadableStreamWithMime = {
  stream: ReadableStream<Uint8Array>;
  mime: string | undefined;
};

interface AsyncIterableWithReturn<T> extends AsyncIterable<T> {
  return?: (value?: any) => Promise<IteratorResult<T>>;
}

const getUint8ArrayMime = async (raw: Uint8Array): Promise<string> =>
  (await fileTypeFromBuffer(raw))?.mime || 'text/plain';

// eslint-disable-next-line import/no-unused-modules
export async function asyncGeneratorToReadableStream(
  source:
    | AsyncIterableWithReturn<Uint8Array>
    | AsyncGenerator<Uint8Array, any, any>
): Promise<ReadableStreamWithMime> {
  const iterator = source[Symbol.asyncIterator]();
  // let firstChunk: Uint8Array | null = null;
  const chunk = await iterator.next();
  const firstChunk: Uint8Array | null = chunk.value;
  const mime = firstChunk ? await getUint8ArrayMime(firstChunk) : undefined;

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        if (firstChunk !== null) {
          controller.enqueue(firstChunk);
          // firstChunk = null;
        }
        const chunk = await iterator.next();
        if (chunk.done) {
          controller.close();
        } else {
          controller.enqueue(chunk.value);
        }
      } catch (error) {
        controller.error(error);
      }
    },
    cancel(reason) {
      if (source.return) {
        source.return(reason);
      }
    },
  });

  return { mime, stream };
  // return stream.pipeThrough(new WritableStream());
}

export async function arrayToReadableStream(
  source: Uint8Array
): Promise<ReadableStreamWithMime> {
  const mime = await getUint8ArrayMime(source);
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        controller.enqueue(source);
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    cancel(reason) {
      throw Error('Not implemented');
    },
  });

  return { mime, stream };
  // return stream.pipeThrough(new WritableStream());
}

// eslint-disable-next-line import/no-unused-modules, func-names
export const readableStreamToAsyncGenerator = async function* <T>(
  stream: ReadableStream<T>
): AsyncGenerator<T> {
  const reader = stream.getReader();
  try {
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
};

export const readStreamDummy = async (cid: string, stream: ReadableStream) => {
  const reader = stream.getReader();
  const chunks: Array<Uint8Array> = [];
  return reader.read().then(function readStream({ done, value }) {
    if (done) {
      return uint8ArrayConcat(chunks);
    }

    chunks.push(value);

    return reader.read().then(readStream);
  });
};
