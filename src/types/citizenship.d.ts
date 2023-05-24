export type Citizenship = {
  owner: string;
  approvals: any[];
  token_uri: string | null;
  extension: {
    addresses: {
      label: string | null;
      address: string;
    }[];
    avatar: string;
    nickname: string;
    data: any | null;
    particle: string | null;
  };
};
