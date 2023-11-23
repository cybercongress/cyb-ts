import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/** Polls a `/status` endpoint on a given Axios RPC config and publishes to an arbitrary set of subsribers. */
class PollingStatusSubscription {
  protected readonly rpcInstance: AxiosInstance;

  protected _subscriptionCount = 0;

  protected _handlers: ((data: any) => void)[] = [];

  constructor(
    protected readonly rpc: string,
    protected readonly rpcConfig?: AxiosRequestConfig
  ) {
    this.rpcInstance = Axios.create({
      ...{
        baseURL: rpc,
      },
      ...rpcConfig,
    });
  }

  get subscriptionCount(): number {
    return this._subscriptionCount;
  }

  /**
   * @param handler
   * @return unsubscriber
   */
  subscribe(handler: (data: any) => void): () => void {
    this._handlers.push(handler);

    this.increaseSubscriptionCount();

    return () => {
      this._handlers = this._handlers.filter((h) => h !== handler);
      this.decreaseSubscriptionCount();
    };
  }

  protected async startSubscription() {
    while (this._subscriptionCount > 0) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        // 7.5 sec.
        setTimeout(resolve, 7500);
      });

      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await this.rpcInstance.get('/status');
        if (response.status === 200) {
          this._handlers.forEach((handler) => handler(response.data));
        }
      } catch (e: any) {
        console.error(`Failed to fetch /status: ${e?.toString()}`);
      }
    }
  }

  protected increaseSubscriptionCount() {
    this._subscriptionCount++;

    if (this._subscriptionCount === 1) {
      // No need to await
      this.startSubscription();
    }
  }

  protected decreaseSubscriptionCount() {
    this._subscriptionCount--;
  }
}

export default PollingStatusSubscription;
