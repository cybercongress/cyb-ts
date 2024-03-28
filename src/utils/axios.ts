import { AxiosResponse } from 'axios';

export function dataOrNull<T>(response: AxiosResponse<T>) {
  try {
    return response.data;
  } catch (e) {
    return null;
  }
}
