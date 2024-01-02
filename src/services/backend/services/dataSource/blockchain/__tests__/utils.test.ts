import { fetchIterable } from '../utils';

describe('fetchIterable', () => {
  it('should iterate over fetched items', async () => {
    const mockFetchFunction = jest
      .fn()
      .mockResolvedValueOnce([1, 2, 3])
      .mockResolvedValueOnce([]);
    const cyberIndexUrl = 'mockUrl';
    const id = 'mockId';
    const timestamp = 12345;

    const iterable = fetchIterable(
      mockFetchFunction,
      cyberIndexUrl,
      id,
      timestamp
    );

    const result1 = await iterable.next();
    expect(result1.value).toEqual([1, 2, 3]);

    const result2 = await iterable.next();
    expect(result2.done).toBe(true);

    expect(mockFetchFunction).toHaveBeenCalledWith(
      cyberIndexUrl,
      id,
      timestamp,
      0
    );
    expect(mockFetchFunction).toHaveBeenCalledWith(
      cyberIndexUrl,
      id,
      timestamp,
      3
    );
  });
});
