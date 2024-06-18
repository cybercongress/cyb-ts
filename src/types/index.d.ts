import type { Store } from 'src/redux/store';

export type Option<T> = T | undefined;
export type Nullable<T> = T | null | undefined;
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
declare global {
  interface Window {
    __TAURI__: any;
    store: Store;
    clipboardData?: DataTransfer;
  }
}
