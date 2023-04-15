import { fileTypeFromBuffer } from 'file-type';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';

type ReadableStreamWithMime = {
  stream: ReadableStream<Uint8Array>;
  mime: string | undefined;
  blob?: Blob;
};

type StreamDoneCallback = (
  chunks: Array<Uint8Array>,
  mime: string | undefined
) => Promise<unknown>;

interface AsyncIterableWithReturn<T> extends AsyncIterable<T> {
  return?: (value?: unknown) => Promise<IteratorResult<T>>;
}

const getUint8ArrayMime = async (raw: Uint8Array): Promise<string> =>
  (await fileTypeFromBuffer(raw))?.mime || 'text/plain';

// eslint-disable-next-line import/no-unused-modules
/**
 * Convert async generator to readable stream, with mime type
 * callback is called when stream is done
 * @param source
 * @param callback
 * @returns
 */
export async function asyncGeneratorToReadableStream(
  source:
    | AsyncIterableWithReturn<Uint8Array>
    | AsyncGenerator<Uint8Array, any, any>,
  callback?: StreamDoneCallback
): Promise<ReadableStreamWithMime> {
  const iterator = source[Symbol.asyncIterator]();
  const chunk = await iterator.next();
  const firstChunk: Uint8Array | null = chunk.value;
  const mime = firstChunk ? await getUint8ArrayMime(firstChunk) : undefined;
  const chunks: Array<Uint8Array> = [];

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        if (firstChunk !== null) {
          controller.enqueue(firstChunk);
          callback && chunks.push(firstChunk);
        }
        const chunk = await iterator.next();
        if (chunk.done) {
          controller.close();
          callback && callback(chunks, mime);
        } else {
          controller.enqueue(chunk.value);
          callback && chunks.push(chunk.value);
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
      throw Error(`Not implemented: ${reason}`);
    },
  });

  return { mime, stream };
  // return stream.pipeThrough(new WritableStream());
}

// eslint-disable-next-line import/no-unused-modules, func-names

/**
 * Converts ReadableStream to AsyncGenerator
 * @param stream
 * @returns
 */
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

export const readStreamFully = async (
  cid: string,
  stream: ReadableStream<Uint8Array>
) => {
  try {
    const reader = stream.getReader();
    const chunks: Array<Uint8Array> = [];
    return reader.read().then(function readStream({ done, value }) {
      if (done) {
        return uint8ArrayConcat(chunks);
      }

      chunks.push(value);

      return reader.read().then(readStream);
    });
  } catch (error) {
    console.error(
      `Error reading stream for ${cid}\r\n Probably Hot reload error!`,
      error
    );

    return undefined;
  }
};
