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
        observer.complete();
      })
      .catch((error) => {
        console.log('----promiseToObservable error', error); //, error
        observer.error(error);
      });
  });
}

export function convertTimeToMilliseconds(timeValue: string | number): number {
  if (typeof timeValue === 'number') {
    return timeValue;
  }
  const numericValue = parseFloat(timeValue);

  const unit = timeValue
    .replace(numericValue.toString(), '')
    .trim()
    .toLowerCase();

  switch (unit) {
    case 'ms':
    case '':
      return numericValue;
    case 's':
      return numericValue * 1000;
    case 'm':
      return numericValue * 60 * 1000;
    case 'h':
      return numericValue * 60 * 60 * 1000;
    case 'd':
      return numericValue * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }
}
