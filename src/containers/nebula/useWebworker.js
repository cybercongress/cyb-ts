// import { useEffect, useRef, useState } from 'react';

// const workerHandler = (fn) => {
//   onmessage = (event) => {
//     console.log('event', event)
//     postMessage(fn(event.data));
//   };
// };

// export const useWebworker = (fn) => {
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   const workerRef = useRef(null);

//   useEffect(() => {
//     const worker = new Worker(
//       URL.createObjectURL(new Blob([`(${workerHandler})(${fn})`]))
//     );
//     console.log('worker', worker)
//     workerRef.current = worker;
//     worker.onmessage = (event) => setResult(event.data);
//     worker.onerror = (error) => setError(error.message);
//     return () => {
//       worker.terminate();
//     };
//   }, [fn]);

//   return {
//     result,
//     error,
//     run: (value) => workerRef.current.postMessage(value),
//   };
// };

// export const useDisposableWebworker = (fn) => {
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   const run = (value) => {
//     const worker = new Worker(
//       URL.createObjectURL(new Blob([`(${workerHandler})(${fn})`]))
//     );
//     worker.onmessage = (event) => {
//       setResult(event.data);
//       worker.terminate();
//     };
//     worker.onerror = (error) => {
//       setError(error.message);
//       worker.terminate();
//     };
//     worker.postMessage(value);
//   };

//   return {
//     result,
//     error,
//     run,
//   };
// };
