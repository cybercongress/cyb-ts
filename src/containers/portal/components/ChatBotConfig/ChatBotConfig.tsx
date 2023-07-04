import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

import { Button, ContainerGradientText, Input } from 'src/components';
import { ContainerKeyValue } from 'src/containers/ipfsSettings/ipfsComponents/utilsComponents';
// import Tooltip from 'src/components/tooltip/tooltip';
import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { useSigningClient } from 'src/contexts/signerClient';
import * as webllm from '@mlc-ai/web-llm';

import { WebLLMInstance } from 'src/services/scripting/webLLM';

import { MainContainer } from '..';

type BotConfig = {
  name: string;
  model: string;
  params: string;
};

function ChatBotConfig() {
  const { defaultAccount, accounts } = useSelector(
    (state: RootState) => state.pocket
  );
  // TODO: move 'nickname' to reducer
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [config, setConfig] = useState<BotConfig>({
    name: 'Trotsky Bot',
    model: '',
    params: '',
  });
  const [messages, setMessages] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [chatReply, setChatReply] = useState('');

  const text = useMemo(
    () => [...messages, chatReply].join('\r\n'),
    [messages, chatReply]
  );
  const nickname = passport?.extension.nickname;
  const botName = config.name;

  const onMessage = async () => {
    setMessages((messages) => [...messages, `${nickname}: ${userMessage}`]);
    setUserMessage('');
    const reply = await WebLLMInstance.chat(userMessage, (step, message) => {
      setChatReply(`${botName}: ${message}`);
    });

    setMessages((messages) => [...messages, `${botName}: ${reply}`]);
    setChatReply('');
  };

  return (
    <MainContainer>
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        <div>Config your LLM bot </div>
        {['name', 'model', 'params'].map((name) => (
          <ContainerKeyValue key={`config_${name}`}>
            <div>{name}</div>
            <Input
              value={config[name]}
              onChange={(e) =>
                setConfig((c) => ({ ...c, [name]: e.target.value }))
              }
            />
          </ContainerKeyValue>
        ))}

        <Button>Save</Button>
      </ContainerGradientText>
      <br />
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        <div>Chat with {config.name} </div>
        <textarea value={text} className="resize-none" rows={18} />
        <Input
          placeholder="message..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <Button onClick={onMessage}>Say</Button>
      </ContainerGradientText>
    </MainContainer>
  );
}

export default ChatBotConfig;
