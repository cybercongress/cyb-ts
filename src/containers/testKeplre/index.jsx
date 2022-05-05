import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';

import { coin, coins } from '@cosmjs/launchpad';
import {
  SigningCyberClient,
  SigningCyberClientOptions,
} from '@cybercongress/cyber-js';
import { Tablist, Pane } from '@cybercongress/gravity';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';
import { trimString, formatNumber, reduceBalances } from '../../utils/utils';
import { Btn } from './ui';
import Convert from './convert';
import { getPinsCid } from '../../utils/search/utils';
import Denom from '../../components/denom';

import DenomTest from './testDenom';
import AddTest from './testAdd';
import {Signatures} from '../portal/components';

// const token = Buffer.from(`anonymas:mouse123west`, 'utf8').toString('base64');
const token = 'anonymas:mouse123west';

// const headers = {
//   authorization: `Basic YW5vbnltYXM6bW91c2UxMjN3ZXN0`,
// };

const addressTest = 'bostrom19nk207agguzdvpj9nqsf4zrjw8mcuu9afun3fv';

const headers = {
  'Content-Type': 'application/json',
};

const bootTocyb =
  'pool5D83035BE0E7AB904379161D3C52FB4C1C392265AC19CE39A864146198610628';
const milliampere = 'milliampere';

const testDenom =
  'ibc/13B2C536BB057AC79D5696B8EA1B6720EC1F2170708CAFF6F0183C963FFFED0B';

function TestKeplr() {
  const { keplr, jsCyber } = useContext(AppContext);
  // return <Denom denomValue={testDenom} />;
  // return <DenomTest />;

  const checkGift = async () => {
    const response = await axios({
      method: 'GET',
      url:
        'https://titan.cybernode.ai/graphql/api/rest/get-cybergift/0x0000000c01915e253a7f1017c975812edd5e8ec3',
    });

    console.log('response', response.data);
  };
  const getCredit = useCallback(async () => {
    try {
      const fromData = {
        denom: 'boot',
        address: addressTest,
      };
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8000/credit',
        headers,
        data: JSON.stringify(fromData),
      });
      console.log('response', response);
      getAccount(addressTest);
    } catch (error) {
      console.log('getCredit', error);
    }
  }, []);

  const getAccount = useCallback(
    async (address) => {
      if (jsCyber !== null) {
        // const response = await jsCyber.getAccount(address);
        const response = await jsCyber.getBalance(address, 'boot');
        console.log('response', response);
      }
    },
    [jsCyber]
  );

  return (
    <main className="block-body" style={{ alignItems: 'center' }}>
      <div>
        <Signatures addressActive={{ bech32: addressTest }} />
        {/* <button type="button" onClick={checkGift}>
          getCredit
        </button> */}
      </div>
    </main>
  );
}

export default TestKeplr;
