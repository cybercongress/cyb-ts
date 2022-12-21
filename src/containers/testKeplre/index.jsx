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
import { NumericFormat } from 'react-number-format';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';
import { trimString, formatNumber, reduceBalances } from '../../utils/utils';
import { Btn } from './ui';
import Convert from './convert';
import { getPinsCid } from '../../utils/search/utils';
import Denom from '../../components/denom';

import DenomTest from './testDenom';
import AddTest from './testAdd';
import { Signatures } from '../portal/components';
import Carousel from '../portal/gift/carousel1/Carousel';
import ImgDenom from '../../components/valueImg/imgDenom';
import CoinDenom from '../../components/valueImg/textDenom';
import { Input } from '../teleport/components';

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
  'ibc/8D9262E35CAE362FA74AE05E430550757CF8D842EC1B241F645D3CB7179AFD10';

const slidesTest = [
  {
    title: 'STEP_GIFT_INFO',
  },
  {
    title: 'STEP_PROVE_ADD',
  },
  {
    title: 'STEP_CLAIME',
  },
];

const DEFAULT_GAS_LIMITS = 200000;

const fee = {
  amount: [],
  gas: (DEFAULT_GAS_LIMITS * 2).toString(),
};

function TestKeplr() {
  const { keplr, jsCyber } = useContext(AppContext);
  const [resultTxs, setResultTxs] = useState('');

  const onClickKeplr = useCallback(async () => {
    if (keplr !== null) {
      const [{ address }] = await keplr.signer.getAccounts();

      const recipient = address;
      const amount = 1;

      const result = await keplr.sendTokens(
        address,
        recipient,
        coins(amount, CYBER.DENOM_CYBER),
        fee
      );
      setResultTxs(JSON.stringify(result));

      // setTimeout(() => {
      //   setResultTxs('');
      // }, 5000);
    }
  }, [keplr]);

  return (
    <main className="block-body" style={{ alignItems: 'center' }}>
      {/* <CoinDenom coinDenom={testDenom} tooltipStatus />
      <NumericFormat
        type="text"
        id="a"
        value={1231231}
        onValueChange={(values, sourceInfo) =>
          console.log('e onChangeValue', values, sourceInfo.event.target.id)
        }
        customInput={Input}
        thousandsGroupStyle="thousand"
        thousandSeparator=","
        decimalScale={3}
      /> */}
      {/* <ImgDenom coinDenom={testDenom} /> */}
      {/* <Carousel slides={slidesTest} /> */}
      {/* <Signatures addressActive={{ bech32: addressTest }} /> */}
      <button type="button" onClick={onClickKeplr}>
        test keplr
      </button>

      <div
        style={{
          marginTop: '50px',
          textOverflow: 'ellipsis',
          maxWidth: '600px',
          overflowX: 'hidden',
        }}
      >
        {resultTxs}
      </div>
    </main>
  );
}

export default TestKeplr;
