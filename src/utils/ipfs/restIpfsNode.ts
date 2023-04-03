import axios from 'axios';
import { Pin, AddResult } from 'kubo-rpc-client/types';
import { Option } from 'src/types/common';
import { create } from 'ipfs-http-client';

export default class RestIpfsNode {
  readonly nodeUrl: string;

  private async fetch(
    method: 'GET' | 'POST',
    path: string,
    data?: unknown
  ): Promise<unknown> {
    const url = `${this.nodeUrl}${path}`;
    try {
      const response = await axios({
        method,
        url,
        data,
      });
      return response.data;
    } catch (error) {
      // TODO: refactor
      console.log(error);
      return null;
    }
  }

  constructor(nodeUrl: string) {
    this.nodeUrl = nodeUrl;
  }

  async pin(cid: string): Promise<Option<Pin>> {
    console.log(`pinToIpfsClusterPost`);
    return (await this.fetch('POST', `/pins/${cid}`)) as Option<Pin>;
  }

  async pinInfo(cid: string): Promise<Option<unknown>> {
    return (await this.fetch('GET', `/pins/${cid}`)) as Option<unknown>;
  }

  async add(data: FormData): Promise<Option<AddResult>> {
    return (await this.fetch('POST', '/add', data)) as Option<AddResult>;
  }
}
