import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

import { Button, ContainerGradientText, Input } from 'src/components';
import { ContainerKeyValue } from 'src/containers/ipfsSettings/ipfsComponents/utilsComponents';
// import Tooltip from 'src/components/tooltip/tooltip';
import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { useSigningClient } from 'src/contexts/signerClient';

import { WebLLMInstance } from 'src/services/scripting/webLLM';

import { MainContainer } from '..';
import styles from './ChatBotConfig.module.scss';

type ChatReply = {
  name: string;
  message: string;
  date: number;
};

const loadChatHistory = () => {
  const chatHistory = localStorage.getItem('chat_bot_history');
  return chatHistory ? (JSON.parse(chatHistory) as ChatReply[]) : [];
};

const saveChatHistory = (history: ChatReply[]) => {
  localStorage.setItem('chat_bot_history', JSON.stringify(history));
};

function ChatBotConfig() {
  const { defaultAccount, accounts } = useSelector(
    (state: RootState) => state.pocket
  );
  // TODO: move 'nickname' to reducer
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [config, setConfig] = useState(WebLLMInstance.config);
  const [inProgress, setIsProgress] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatReply[]>(
    loadChatHistory()
  );

  const addToChatHistory = (name: string, message: string) => {
    setChatHistory((prevChatHistory) => {
      const newChatHistory = [
        ...prevChatHistory,
        { name, message, date: Date.now() },
      ];
      saveChatHistory(newChatHistory);
      return newChatHistory;
    });
  };

  const [userMessage, setUserMessage] = useState('');
  const [chatReply, setChatReply] = useState<ChatReply>();

  const messagesItems = useMemo(
    () =>
      [...chatHistory, chatReply]
        .filter((i) => !!i)
        .map(({ date, message, name }) => (
          <div className={styles.msg} key={`msg_${name}_${date}`}>
            <span>{`[${new Date(date).toLocaleString()}]`}</span>{' '}
            <span>{name}:</span> <span>{message}</span>
          </div>
        )),
    [chatHistory, chatReply]
  );

  const nickname = passport?.extension.nickname;
  const botName = config.name;
  const onSaveClick = () => {
    WebLLMInstance.updateConfig(config);
  };
  const onClearClick = () => {
    WebLLMInstance.resetChat();
    saveChatHistory([]);
    setChatHistory([]);
  };
  const onMessage = async () => {
    addToChatHistory(nickname || 'anonymous', userMessage);
    setChatReply({
      name: botName,
      message: 'thinking ... 💡',
      date: Date.now(),
    });
    setUserMessage('');
    setIsProgress(true);
    WebLLMInstance.chat(userMessage, (step, message) => {
      setChatReply({ name: botName, message, date: Date.now() });
    })
      .then((replyMessage) => {
        addToChatHistory(botName, replyMessage);
        setChatReply(undefined);
      })
      .catch((e) => {
        addToChatHistory('sys', e.toString());
      })
      .finally(() => setIsProgress(false));
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

        <Button onClick={onSaveClick}>Save</Button>
      </ContainerGradientText>
      <br />
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        <div>Chat with {config.name} </div>
        <div>{messagesItems}</div>
        <Input
          placeholder="message..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <Button onClick={onMessage} disabled={inProgress}>
          Say
        </Button>
        <button
          type="button"
          className={styles.btnClear}
          onClick={onClearClick}
        >
          Clear chat history
        </button>
      </ContainerGradientText>
    </MainContainer>
  );
}

export default ChatBotConfig;
