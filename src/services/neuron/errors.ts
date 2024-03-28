import { DeliverTxResponse } from '@cosmjs/stargate';

export class SigningCyberClientError extends Error {
  public code: number;

  constructor(response: string[] | DeliverTxResponse) {
    let message = '';
    let code = -1;
    if (response instanceof Array) {
      message = response.join('\r\n');
    } else if (response.rawLog) {
      message = response.rawLog.toString();
      code = response.code;
    } else {
      message = message?.error;
    }

    super(message);
    cyblog.error(message, { error: response });

    this.code = code;
  }
}

export const throwErrorOrResponse = (
  response: string[] | DeliverTxResponse
) => {
  const isResponseError = response instanceof Array || response.code !== 0;
  if (isResponseError) {
    throw new SigningCyberClientError(response);
  }
  return response as DeliverTxResponse;
};
