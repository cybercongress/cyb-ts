const WsReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  // WS is not initialized or the ready state of WS is unknown
  NONE: null,
};

class TracerTx {
  constructor(url, wsEndpoint) {
    this.txSubscribes = new Map();
    this.pendingQueries = new Map();
    this.url = url;
    this.wsEndpoint = wsEndpoint;
    this.ws = null;
    this.open();
  }

  getWsEndpoint() {
    let { url } = this;
    if (url.startsWith('http')) {
      url = url.replace('http', 'ws');
    }
    if (!url.endsWith(this.wsEndpoint)) {
      const wsEndpoint = this.wsEndpoint.startsWith('/')
        ? this.wsEndpoint
        : `/${this.wsEndpoint}`;

      url = url.endsWith('/') ? url + wsEndpoint.slice(1) : url + wsEndpoint;
    }

    return url;
  }

  open = async () => {
    this.ws = new WebSocket(this.getWsEndpoint());
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onclose = this.onClose;
  };

  close() {
    this.ws.close();
  }

  readyState() {
    switch (this.ws.readyState) {
      case 0:
        return WsReadyState.CONNECTING;
      case 1:
        return WsReadyState.OPEN;
      case 2:
        return WsReadyState.CLOSING;
      case 3:
        return WsReadyState.CLOSED;
      default:
        return WsReadyState.NONE;
    }
  }

  // Query the tx and subscribe the tx.
  traceTx(query) {
    return new Promise((resolve) => {
      // At first, try to query the tx at the same time of subscribing the tx.
      // But, the querying's error will be ignored.
      this.queryTx(query)
        .then((result) => {
          if (query instanceof Uint8Array) {
            resolve(result);
            return;
          }

          if (result?.total_count !== '0') {
            resolve(result);
          }
        })
        .catch((e) => {
          // noop
          console.log(e);
        });

      this.subscribeTx(query).then(resolve);
    });
  }

  subscribeTx(query) {
    if (query instanceof Uint8Array) {
      const id = this.createRandomId();

      const params = {
        query: `tm.event='Tx' AND tx.hash='${Buffer.from(query)
          .toString('hex')
          .toUpperCase()}'`,
      };

      return new Promise((resolve, reject) => {
        this.txSubscribes.set(id, {
          params,
          resolver: resolve,
          rejector: reject,
        });

        this.sendSubscribeTxRpc(id, params);
      });
    }
    const id = this.createRandomId();

    const params = {
      query: `tm.event='Tx' and ${Object.keys(query)
        .map((key) => {
          return {
            key,
            value: query[key],
          };
        })
        .map((obj) => {
          return `${obj.key}=${
            typeof obj.value === 'string' ? `'${obj.value}'` : obj.value
          }`;
        })
        .join(' and ')}`,
      page: '1',
      per_page: '1',
      order_by: 'desc',
    };

    return new Promise((resolve, reject) => {
      this.txSubscribes.set(id, {
        params,
        resolver: resolve,
        rejector: reject,
      });

      this.sendSubscribeTxRpc(id, params);
    });
  }

  sendSubscribeTxRpc(id, params) {
    if (this.readyState === WsReadyState.OPEN) {
      this.ws.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'subscribe',
          params,
          id,
        })
      );
    }
  }

  queryTx(query) {
    if (query instanceof Uint8Array) {
      return this.query('tx', {
        hash: Buffer.from(query).toString('base64'),
        prove: false,
      });
    }
    const params = {
      query: Object.keys(query)
        .map((key) => {
          return {
            key,
            value: query[key],
          };
        })
        .map((obj) => {
          return `${obj.key}=${
            typeof obj.value === 'string' ? `'${obj.value}'` : obj.value
          }`;
        })
        .join(' and '),
      page: '1',
      per_page: '1',
      order_by: 'desc',
    };

    return this.query('tx_search', params);
  }

  query(method, params) {
    const id = this.createRandomId();

    return new Promise((resolve, reject) => {
      this.pendingQueries.set(id, {
        method,
        params,
        resolver: resolve,
        rejector: reject,
      });

      this.sendQueryRpc(id, method, params);
    });
  }

  sendQueryRpc = (id, method, params) => {
    if (!this.ws.readyState) {
      setTimeout(() => {
        this.sendQueryRpc(id, method, params);
      }, 100);
    } else {
      this.ws.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id,
        })
      );
    }
  };

  // eslint-disable-next-line class-methods-use-this
  createRandomId = () => {
    return parseInt(
      Array.from({ length: 6 })
        .map(() => Math.floor(Math.random() * 100))
        .join(''),
      10
    );
  };

  // eslint-disable-next-line class-methods-use-this
  onOpen = (e) => {
    console.log('onOpen', e);
  };

  onMessage = (e) => {
    if (e.data) {
      try {
        const obj = JSON.parse(e.data);
        console.log('obj', obj);

        if (obj?.id) {
          if (this.pendingQueries.has(obj.id)) {
            if (obj.error) {
              this.pendingQueries
                .get(obj.id)
                .rejector(new Error(obj.error.data || obj.error.message));
            } else {
              this.pendingQueries.get(obj.id).resolver(obj.result);
            }

            this.pendingQueries.delete(obj.id);
          }
        }

        if (obj?.result?.data?.type === 'tendermint/event/Tx') {
          if (obj?.id) {
            if (this.txSubscribes.has(obj.id)) {
              if (obj.error) {
                this.txSubscribes
                  .get(obj.id)
                  .rejector(new Error(obj.error.data || obj.error.message));
              } else {
                this.txSubscribes
                  .get(obj.id)
                  .resolver(obj.result.data.value.TxResult.result);
              }

              this.txSubscribes.delete(obj.id);
            }
          }
        }
      } catch (error) {
        console.log(
          `Tendermint websocket jsonrpc response is not JSON: ${
            e.message || error.toString()
          }`
        );
      }
    }
  };

  // eslint-disable-next-line class-methods-use-this
  onClose = (e) => {
    console.log('onClose', e);
  };
}

// eslint-disable-next-line import/no-unused-modules
export default TracerTx;
