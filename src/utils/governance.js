import axios from 'axios';
import { indexedNode } from './config';

export const getProposals = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${indexedNode}/lcd/gov/proposals`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );
