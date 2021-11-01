import React, { useState, useEffect, useContext } from 'react';
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
import { trimString, formatNumber } from '../../utils/utils';
import { Btn } from './ui';
import Convert from './convert';

// const token = Buffer.from(`anonymas:mouse123west`, 'utf8').toString('base64');
const token = 'anonymas:mouse123west';

const headers = {
  authorization: `Basic YW5vbnltYXM6bW91c2UxMjN3ZXN0`,
};

const url =
  'https://io.cybernode.ai/pins/QmU713Qs3atZVXfNc2jV1maGNsA2sKLR5YDXvfed86ZneP';

export const getVersion = async () => {
  try {
    const response = await axios({
      method: 'get',
      url:
        'https://io.cybernode.ai/pins/QmU713Qs3atZVXfNc2jV1maGNsA2sKLR5YDXvfed86ZneP',
      auth: {
        username: 'anonymas',
        password: 'mouse123west',
      },
    });
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

function TestKeplr({ block }) {
  window.block = block;

  useEffect(() => {
    const getResponse = async () => {
      const data = await getVersion();
      
      console.log(`data`, data);
    };
    getResponse();
  }, []);

  return (
    // <webview
    //   id="foo"
    //   src="https://ipfs.io/ipfs/QmU713Qs3atZVXfNc2jV1maGNsA2sKLR5YDXvfed86ZneP/#/swap"
    //   style="display:inline-flex; width:640px; height:480px"
    // ></webview>
    <div>0</div>

    // <ReactMarkdown
    //   source="https://ipfs.io/ipfs/QmU713Qs3atZVXfNc2jV1maGNsA2sKLR5YDXvfed86ZneP/#/swap"
    //   // escapeHtml
    //   // skipHtml={false}
    //   // astPlugins={[parseHtml]}
    //   // renderers={{ code: CodeBlock }}
    //   // plugins={[toc]}
    //   // escapeHtml={false}
    // />
  );
}

const mapStateToProps = (store) => {
  return {
    block: store.block.block,
  };
};

export default connect(mapStateToProps)(TestKeplr);
