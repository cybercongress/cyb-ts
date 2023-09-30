export enum TypeRecipient {
  'my' = 'my',
  'friends' = 'friends',
  'following' = 'following',
}

export type DataItem = {
  nickname: string | undefined;
  cidAvatar: undefined | string;
  owner: string;
};
