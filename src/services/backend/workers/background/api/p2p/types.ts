import { NeuronPeerId } from 'src/types/base';

export const PUBSUB_PIN_REQUEST = 'pubsub_pin_request';
export const PUBSUB_PIN_RESPONSE = 'pubsub_pin_response';
export const PUBSUB_CHAT_MESSAGE = 'chat_message';

export type P2PResponsePins = {
  type: typeof PUBSUB_PIN_RESPONSE;
  pins: string[];
};

export type P2PRequestPins = {
  type: typeof PUBSUB_PIN_REQUEST;
};

export type P2PChatMessage = {
  type: typeof PUBSUB_CHAT_MESSAGE;
  message: string;
};

export type PubSubMessage = P2PResponsePins | P2PRequestPins | P2PChatMessage;
export type PubSubPeerId = { peerId: NeuronPeerId };
export type PubSubMessageWitPeerId = PubSubMessage & PubSubPeerId;

export type onMessage<T> = (message: T & PubSubPeerId) => void;
