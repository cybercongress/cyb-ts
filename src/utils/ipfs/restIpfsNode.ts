import axios from 'axios';

export class RestIpfsNode {
  readonly node_url: string;

  private async fetch(
    method: 'GET' | 'POST',
    path: string,
    data?: any
  ): Promise<any> {
    const url = `${this.node_url}${path}`;
    try {
      const response = await axios({
        method,
        url,
        data,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  constructor(node_url: string) {
    this.node_url = node_url;
  }

  async pin(cid: string) {
    console.log(`getPinsCidPost`);
    return await this.fetch('POST', `/pins/${cid}`);
  }

  async pinInfo(cid: string) {
    return await this.fetch('GET', `/pins/${cid}`);
  }

  async add(data: FormData) {
    return await this.fetch('POST', '/add', data);
  }
}
