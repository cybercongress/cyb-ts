export function* valuesExpected<T>(values: T[]): Generator<T> {
  for (let i = 0; i < values.length; i++) {
    yield values[i];
  }
}
