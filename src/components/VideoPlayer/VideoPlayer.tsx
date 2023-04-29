/* eslint-disable no-restricted-syntax */
import React, { useRef, useEffect } from 'react';
import { IPFSContent, IpfsContentSource } from 'src/utils/ipfs/ipfs';
import { Readable, Transform } from 'readable-stream';
import VideoStream from 'videostream';
import { useIpfs } from 'src/contexts/ipfs';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import { getResponseResult } from 'src/utils/ipfs/stream-utils';

interface VideoPlayerProps {
  content: IPFSContent;
  source: IpfsContentSource;
  raw: Uint8Array;
}
async function* logAsyncIterable<T>(input: AsyncIterable<T>): AsyncIterable<T> {
  for await (const item of input) {
    console.log('chunklog', item); // log each chunk
    yield item; // return each chunk
  }
}

function* waitForFlag(flag) {
  return new Promise((resolve) => {
    const checkFlag = () => {
      if (flag) {
        resolve();
      } else {
        setTimeout(checkFlag, 1000);
      }
    };
    checkFlag();
  });
}

async function* chunkArray(
  arr: Uint8Array,
  offset: number,
  N: number
): AsyncIterable<Uint8Array> {
  const length = arr.length;
  let i = offset;
  while (i < length) {
    yield arr.subarray(i, i + N);
    i += N;
  }
}

async function* chunkArrayAndWait(
  arr: Uint8Array,
  contentLength: number,
  offset: number,
  N: number
): AsyncIterable<Uint8Array> {
  let i = offset;
  const doWork = i < contentLength;
  console.log('---chunke and wait', doWork, offset, arr.length, contentLength);
  waitForFlag(!doWork);
  yield* chunkArray(arr, offset, N);
}

const downloadData = async (response: AsyncIterable<Uint8Array>, callback) => {
  try {
    const reader = response[Symbol.asyncIterator]();
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of reader) {
      if (chunk instanceof Uint8Array) {
        callback(chunk);
        // chunks.push(chunk);
      }
    }

    return;
  } catch (error) {
    console.error(`Error error!`, error);

    return undefined;
  }
};

function VideoPlayer({ content, raw }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<Readable>(null);
  const { node } = useIpfs();

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    // const baseStream = content.result;
    // async function* asyncIterableOffset(
    //   offset: number
    // ): AsyncIterable<Uint8Array> {
    //   let bytesRead = 0;

    //   console.log('---asyncIterableOffset', baseStream);

    //   for await (const chunk of baseStream) {
    //     console.log('---asread', chunk.length);
    //     if (bytesRead + chunk.length <= offset) {
    //       bytesRead += chunk.length;
    //       continue;
    //     }
    //     const start = Math.max(offset - bytesRead, 0);
    //     // yield* chunkArray(chunk.subarray(start), 0, 160000);
    //     console.log('---asreadyeld', chunk.length, start);
    //     yield chunk.subarray(start);
    //     offset -= bytesRead + chunk.length;
    //     bytesRead = 0;
    //     if (offset <= 0) break;
    //     console.log('--iterend', baseStream);
    //   }
    // }

    const load = async () => {
      const path = `/ipfs/QmcnKhvYLYoyfHYUFj8SAyQJSaKNeCexpTvTp8pwg8wNZJ`;
      // const raw = await getResponseResult(content.result);
      // console.log('----VP', node, path, raw);
      let chunkData: Uint8Array = new Uint8Array();
      await downloadData(content.result, (chunk) => {
        chunkData = uint8ArrayConcat([chunkData, chunk]);
      });
      // const data = node.cat(path);
      // if (content.source === 'node') {

      const opts = new VideoStream(
        {
          createReadStream: function createReadStream(opts) {
            const start = opts.start;
            console.log('----VideoStream createReadStream');

            // console.log("----VideoStream before", stream.closed, cnt, opts);
            // The videostream library does not always pass an end byte but when
            // it does, it wants bytes between start & end inclusive.
            // catReadableStream returns the bytes exclusive so increment the end
            // byte if it's been requested
            const end = opts.end ? start + opts.end + 1 : undefined;

            console.log(
              `Stream: Asked for data starting at byte ${start} and ending at byte ${end}`
            );

            // If we've streamed before, clean up the existing stream
            // if (streamRef.current && streamRef.current.destroy) {
            //   streamRef.current.destroy();
            // }
            const dataS = chunkArrayAndWait(
              chunkData,
              content.meta?.size,
              start,
              160000
            );
            // const dataS = asyncIterableOffset(start);

            console.log('---dataS', dataS, content);

            // const dataS2 = node.cat(path, {
            //   offset: start,
            //   length: end && end - start,
            // });
            // console.log('---dataS2', dataS);
            // This stream will contain the requested bytes
            streamRef.current = Readable.from(logAsyncIterable(dataS));
            // streamRef.current = Readable.from(
            //   node.cat(path, {
            //     offset: start,
            //     length: end && end - start,
            //   })
            // );

            // // Log error messages
            streamRef.current.on('error', (error) => {
              console.log('----VideoStream error', error);
            });

            if (start === 0) {
              // Show the user some messages while we wait for the data stream to start
              // console.log('----Start');
            }
            console.log('----VideoStream end');

            return streamRef.current;
          },
        },
        videoRef.current
      );
      // } else if (content.source === 'gateway') {
      //   videoRef.current.src = content.contentUrl;
      // } else {
      //   console.log('Unknown source', content.source);
      // }

      videoRef.current.addEventListener('error', () =>
        console.log(videoRef.current.detailedError)
      );
    };
    load();
  }, [node]);

  return <video ref={videoRef} controls />;
}

export default VideoPlayer;
