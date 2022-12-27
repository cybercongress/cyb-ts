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
import { DenomArr } from '../../components';

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
  'poolBE0F1D1C7FE3E72D18DF1996AB8E76676852A34313D2772E7ED36B041DCAB182';
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

function TestKeplr() {
  const { keplr, jsCyber } = useContext(AppContext);

  return (
    <main className="block-body" style={{ alignItems: 'center' }}>
      <DenomArr denomValue={bootTocyb} />
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
      {/* <button type="button" onClick={checkGift}>
          getCredit
        </button> */}
    </main>
  );
}

export default TestKeplr;
