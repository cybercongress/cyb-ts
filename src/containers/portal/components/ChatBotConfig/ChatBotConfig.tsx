import React, { useCallback, useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { Button, ContainerGradientText, Input } from 'src/components';
import { ContainerKeyValue } from 'src/containers/ipfsSettings/ipfsComponents/utilsComponents';
// import Tooltip from 'src/components/tooltip/tooltip';
import { rust } from '@codemirror/lang-rust';
import {
  scriptItemStorage,
  runScript,
  saveScript,
} from 'src/services/scripting/engine';
import { useSigningClient } from 'src/contexts/signerClient';
import * as webllm from '@mlc-ai/web-llm';

import { WebLLMInstance } from 'src/services/scripting/webLLM';

import { MainContainer } from '..';
import { updatePassportData } from '../../utils';

function ChatBotConfig() {
  const { signer, signingClient } = useSigningClient();

  const [log, setLog] = useState('');
  const [code, setCode] = useState(scriptItemStorage.particle.user);
  useEffect(() => {
    // const chat = new webllm.ChatWorkerClient(new Worker());
    const run = async () => {};
    run();
  }, []);

  const onSave = () => {};

  return (
    <MainContainer>
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        <div>Config your LLM bot </div>
        <ContainerKeyValue>
          <div>model</div>
          <Input placeholder="wasm of model(cid/url)"></Input>
        </ContainerKeyValue>
        <ContainerKeyValue>
          <div>params</div>
          <Input placeholder="params(cid/url)"></Input>
        </ContainerKeyValue>
        <Button>Save</Button>
      </ContainerGradientText>
      <br />
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        <div>Chat with model </div>
        <textarea value={log} className="resize-none" rows={18} />
        <Input placeholder="message..."></Input>
        <Button>Send</Button>
      </ContainerGradientText>
    </MainContainer>
  );
}

export default ChatBotConfig;
