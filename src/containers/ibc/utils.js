const config = {
  chainA: {
    rpcEndpoint: 'http://localhost:26657',
    restEndpoint: 'http://localhost:1317',
    addrPrefix: 'bostrom',
    chainId: 'bostrom1',
    gasPrice: '0.0001boot',
    denom: 'boot',
    mnemonic:
      // "shrug eager kid scale grunt trust slice dose equal jacket speak book arctic spy time trouble output steel provide leave shuffle play wear expand",
      'clap vintage gesture knock say idea immense history ship visit online cool life drift dynamic lava erosion foot expire immune slice kiss tuna produce',
  },
  chainB: {
    rpcEndpoint: 'http://localhost:26647',
    restEndpoint: 'http://localhost:1318',
    addrPrefix: 'bostrom',
    chainId: 'bostrom2',
    gasPrice: '0.0001boot',
    denom: 'boot',
    mnemonic:
      // "lock play cabin penalty trumpet permit correct dinner exchange usage focus normal net tongue present amused bid plunge hill dutch milk mobile obey diagram",
      'chief require busy decrease banner slab audit remember wasp castle plug swing add toward decide identify churn moral food eternal elbow impose across maid',
  },
};

const STEPS = {
  INIT_STATE: 0,
  ENTER_CHAIN_A: 1.1,
  ENTER_CHAIN_B: 1.2,
  SETUP_SIGNERS: 2,
  SETUP_RELAYER: 3,
  RELAYER_READY: 3.1,
  RUN_RELAYER: 4,
  STOP_RELAYER: 5,
};

export { config, STEPS };
