/* eslint-disable valid-jsdoc */
/* eslint-disable import/no-unused-modules */
import { fileTypeFromBuffer } from 'file-type';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';

type ResultWithMime = {
  result: Uint8Array | ReadableStream<Uint8Array>;
  mime: string | undefined;
};

type StreamDoneCallback = (
  chunks: Array<Uint8Array>,
  mime: string | undefined
) => Promise<unknown>;

interface AsyncIterableWithReturn<T> extends AsyncIterable<T> {
  return?: (value?: unknown) => Promise<IteratorResult<T>>;
}

export const getMimeFromUint8Array = async (
  raw: Uint8Array
): Promise<string | undefined> => {
  const fileType = await fileTypeFromBuffer(raw);

  return fileType?.mime || 'text/plain';
};

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
): Promise<ResultWithMime> {
  const iterator = source[Symbol.asyncIterator]();
  const chunks: Array<Uint8Array> = []; // accumulate all the data to pim/save
  const chunk = await iterator.next();
  const firstChunk: Uint8Array | null = chunk.value;
  const mime = firstChunk ? await getMimeFromUint8Array(firstChunk) : undefined;

  if (chunk.done) {
    callback && firstChunk?.length && callback([firstChunk], mime);
    return { mime, result: firstChunk || new Uint8Array() };
  }

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

  return { mime, result: stream };
}

// export async function arrayToReadableStream(
//   source: Uint8Array
// ): Promise<ResultWithMime> {
//   const mime = await getMimeFromUint8Array(source);
//   const stream = new ReadableStream<Uint8Array>({
//     async pull(controller) {
//       try {
//         controller.enqueue(source);
//         controller.close();
//       } catch (error) {
//         controller.error(error);
//       }
//     },
//     cancel(reason) {
//       throw Error(`Not implemented: ${reason}`);
//     },
//   });

//   return { mime, result: stream };
//   // return stream.pipeThrough(new WritableStream());
// }

// eslint-disable-next-line import/no-unused-modules, func-names

// /**
//  * Converts ReadableStream to AsyncGenerator
//  * @param stream
//  * @returns
//  */
// // eslint-disable-next-line func-names
// export const readableStreamToAsyncGenerator = async function* <T>(
//   stream: ReadableStream<T>
// ): AsyncGenerator<T> {
//   const reader = stream.getReader();
//   try {
//     while (true) {
//       // eslint-disable-next-line no-await-in-loop
//       const { done, value } = await reader.read();
//       if (done) {
//         return;
//       }
//       yield value;
//     }
//   } finally {
//     reader.releaseLock();
//   }
// };

export async function toReadableStreamWithMime(
  stream: ReadableStream<Uint8Array>,
  callback?: StreamDoneCallback
): Promise<ResultWithMime> {
  const [firstChunkStream, restOfStream] = stream.tee();
  const chunks: Array<Uint8Array> = []; // accumulate all the data to pim/save

  // Read the first chunk from the stream
  const reader = firstChunkStream.getReader();
  const { done, value } = await reader.read();

  const mime = value ? await getMimeFromUint8Array(value) : undefined;

  if (done) {
    reader.releaseLock();
    callback && value?.length && callback([value], mime);

    return { mime, result: value || new Uint8Array() };
  }

  let firstChunk: Uint8Array | null = value;

  const modifiedStream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (firstChunk !== null) {
        // If the first chunk not processed yet, push it to the new stream
        controller.enqueue(firstChunk);
        callback && chunks.push(firstChunk);

        firstChunk = null;
      } else {
        const restReader = restOfStream.getReader();
        const { done, value } = await restReader.read();
        if (done) {
          controller.close();
          callback && callback(chunks, mime);
        } else {
          controller.enqueue(value);
          callback && chunks.push(value);
        }
        restReader.releaseLock();
      }
    },
    cancel() {
      firstChunkStream.cancel();
      restOfStream.cancel();
    },
  });

  return { mime, result: modifiedStream };
}

export const getResponseResult = async (
  response: ReadableStream<Uint8Array> | Uint8Array
) => {
  try {
    if (response instanceof Uint8Array) {
      return response;
    }

    const reader = response.getReader();
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
      `Error reading stream.\r\n Probably Hot reload error!`,
      error
    );

    return undefined;
  }
};
