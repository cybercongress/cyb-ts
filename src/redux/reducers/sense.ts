import { BroadcastChannelMessage } from 'src/services/backend/types/services';
import { assocPath } from 'ramda';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { SenseListItem } from 'src/services/backend/types/sense';

type SenseState = {
  list: { [key in ParticleCid | NeuronAddress]?: SenseListItem };
};

const initialState: SenseState = {
  list: {},
};

function senseReducer(state = initialState, action: BroadcastChannelMessage) {
  switch (action.type) {
    case 'sense_list_update': {
      const newList = { ...state.list };
      action.list.forEach((item) => {
        newList[item.id] = item;
      });
      return { ...state, list: newList };
    }
    case 'sense_list_remove': {
      const newList = { ...state.list };
      action.list.forEach((item) => {
        delete newList[item.id];
      });
      return { ...state, list: newList };
    }
    default:
      return state;
  }
}

export default senseReducer;
