import { Observable } from 'rxjs';

/**
 * Promise will be rejected after timeout.
 *
 * @param promise
 * @param timeout ms
 * @param abortController trigger abort
 * @returns
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
  abortController?: AbortController
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const timer = setTimeout(() => {
        abortController?.abort('timeout');
        clearTimeout(timer);
        reject(new DOMException('timeout', 'AbortError'));
      }, timeout);
    }),
  ]);
}

/**
 * Convert promise to observable
 * @param promiseFactory
 * @returns
 */
export function promiseToObservable<T>(promiseFactory: () => Promise<T>) {
  return new Observable<T>((observer) => {
    promiseFactory()
      .then((response) => {
        observer.next(response);
      })
      .catch((error) => {
        observer.error(error);
      });
  });
}
