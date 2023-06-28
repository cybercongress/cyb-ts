export type ObjKeyValue = {
  [key: string]: number;
};

type ObjectKey<T> = {
  [key: string]: T;
};
