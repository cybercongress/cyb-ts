/* eslint-disable valid-jsdoc */
/* eslint-disable import/no-unused-modules */
import { fileTypeFromBuffer } from 'file-type';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import { IpfsRawDataResponse } from '../ipfs';

type ResultWithMime = {
  result: IpfsRawDataResponse;
  mime: string | undefined;
  firstChunk: Uint8Array | undefined;
};

type StreamDoneCallback = (
  chunks: Array<Uint8Array>,
  mime: string | undefined
) => Promise<void> | void;

// interface AsyncIterableWithReturn<T> extends AsyncIterable<T> {
//   return?: (value?: unknown) => Promise<IteratorResult<T>>;
// }

export const getMimeFromUint8Array = async (
  raw: Uint8Array | undefined
): Promise<string | undefined> => {
  if (!raw) {
    return 'unknown';
  }
  // TODO: try to pass only first N-bytes
  const fileType = await fileTypeFromBuffer(raw);

  return fileType?.mime || 'text/plain';
};

export async function toAsyncIterableWithMime(
  input: AsyncIterable<Uint8Array>,
  flush?: StreamDoneCallback
): Promise<ResultWithMime> {
  const chunks: Array<Uint8Array> = []; // accumulate all the data to pim/save

  const reader = input[Symbol.asyncIterator]();
  const firstChunk = await reader.next();
  const { value: firstValue, done: firstDone } = firstChunk;
  const mime = firstValue ? await getMimeFromUint8Array(firstValue) : undefined;

  async function* process() {
    flush && chunks.push(firstValue);
    yield firstValue;

    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of input) {
      flush && chunks.push(chunk);
      yield chunk;
    }

    flush && flush(chunks, mime);
  }

  return { mime, result: process() };
}

export async function toReadableStreamWithMime(
  stream: ReadableStream<Uint8Array>,
  flush?: StreamDoneCallback
): Promise<ResultWithMime> {
  const [firstChunkStream, fullStream] = stream.tee();
  const chunks: Array<Uint8Array> = []; // accumulate all the data to pim/save

  // Read the first chunk from the stream
  const firstReader = firstChunkStream.getReader();
  const { value } = await firstReader.read();
  const mime = value ? await getMimeFromUint8Array(value) : undefined;

  const modifiedStream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const restReader = fullStream.getReader();
      const { done, value } = await restReader.read();
      if (done) {
        controller.close();
        flush && flush(chunks, mime);
      } else {
        controller.enqueue(value);
        flush && chunks.push(value);
      }
      restReader.releaseLock();
    },
    cancel() {
      firstChunkStream.cancel();
      fullStream.cancel();
    },
  });

  return { mime, result: modifiedStream, firstChunk: value };
}
export type onProgressCallback = (progress: number) => void;

export const getResponseAsTextPreview = async (
  response: IpfsRawDataResponse | undefined
) => {
  if (!response || response instanceof ReadableStream) {
    return new Uint8Array();
  }
  if (response instanceof Uint8Array) {
    return response;
  }

  return response[Symbol.asyncIterator]().next().value;
};

export const getResponseResult = async (
  response: IpfsRawDataResponse,
  onProgress?: onProgressCallback
) => {
  let bytesDownloaded = 0;
  try {
    if (response instanceof Uint8Array) {
      onProgress && onProgress(response.byteLength);
      return response;
    }
    const chunks: Array<Uint8Array> = [];

    if (response instanceof ReadableStream) {
      const reader = response.getReader();
      return reader.read().then(function readStream({ done, value }) {
        if (done) {
          return uint8ArrayConcat(chunks);
        }

        chunks.push(value);
        bytesDownloaded += value.byteLength;
        onProgress && onProgress(bytesDownloaded);
        return reader.read().then(readStream);
      });
    }

    const reader = response[Symbol.asyncIterator]();
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of reader) {
      if (chunk instanceof Uint8Array) {
        chunks.push(chunk);
        bytesDownloaded += chunk.byteLength;
        onProgress && onProgress(bytesDownloaded);
      }
    }

    return uint8ArrayConcat(chunks);
  } catch (error) {
    console.error(
      `Error reading stream/iterable.\r\n Probably Hot reload error!`,
      error
    );

    return undefined;
  }
};
