import { setDefaultAccount } from 'src/redux/features/pocket';
import { CYB_BROADCAST_CHANNEL } from './consts';

class BroadcastChannelAccount {
  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(CYB_BROADCAST_CHANNEL);
  }

  public postSetDefaultAccount(nameKey: string) {
    this.channel.postMessage(
      setDefaultAccount({
        name: nameKey,
      })
    );
  }
}

export default BroadcastChannelAccount;
