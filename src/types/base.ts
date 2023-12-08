export type NeuronAddress = string;
export type ParticleCid = string;

export type CyberLinkType = {
  from: ParticleCid;
  to: ParticleCid;
};
export type Cyberlink = CyberLinkType & {
  timestamp?: number;
  neuron?: NeuronAddress;
};

export type CyberLinkNeuron = Omit<Cyberlink, 'timestamp'>;
