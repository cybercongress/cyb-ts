import { CID_TWEET } from 'src/constants/app';
import { fetchLinksByNeuronTimestamp } from '../lcd';

describe('fetchLinksByNeuronTimestamp with real LCD', () => {
  it('should iterate over fetched items', async () => {
    const items = await fetchLinksByNeuronTimestamp(
      'https://lcd.bostrom.cybernode.ai',
      'bostrom1uj85l9uar80s342nw5uqjrnvm3zlzsd0392dq3',
      CID_TWEET,
      1698150174000
    );
    console.log(items);
    expect(items.length).toBeGreaterThan(0);
    expect(items.at(-1)?.timestamp).toEqual(1705493602000);
  });
});
