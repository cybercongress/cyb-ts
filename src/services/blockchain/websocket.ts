import { Observable } from 'rxjs';
import { CYBER_NODE_URL_WS } from 'src/constants/config';
import { NeuronAddress } from 'src/types/base';

export const getIncomingTransfersQuery = (address: NeuronAddress) =>
  `tm.event='Tx' AND transfer.recipient='${address}'`;

// eslint-disable-next-line import/no-unused-modules
export function createWebSocketObservable(
  address: NeuronAddress,
  query: string
) {
  return new Observable((subscriber) => {
    const ws = new WebSocket(CYBER_NODE_URL_WS);

    ws.onopen = () => {
      console.log(`WebSocket connected to ${CYBER_NODE_URL_WS} with ${query}`);
      ws.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'subscribe',
          id: '0',
          params: { query },
        })
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(`node ws ${address} onmessage`, message);
      subscriber.next(message.result);
    };

    ws.onerror = (event) => {
      console.log(`node ws ${address} error`, event);
      subscriber.error(event);
    };

    ws.onclose = () => {
      console.log(`node ws ${address} closed`);
      subscriber.complete();
    };

    return () => {
      ws.close();
    };
  });
}
