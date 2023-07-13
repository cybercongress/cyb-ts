import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

import {
  Button,
  ContainerGradientText,
  Input,
  TabBtn,
  Select,
  OptionSelect,
} from 'src/components';
import { ContainerKeyValue } from 'src/containers/ipfsSettings/ipfsComponents/utilsComponents';
// import Tooltip from 'src/components/tooltip/tooltip';
import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { useSigningClient } from 'src/contexts/signerClient';
import { Tablist } from '@cybercongress/gravity';
import LocalStorageAsEditableTable from 'src/components/EditableTable/LocalStorageAsEditableTable';
import { WebLLMInstance } from 'src/services/scripting/webLLM';

import styles from './ChatBotConfig.module.scss';
import defaultBotList from './defaultBotList.json';

const CHAT_BOT_CONFIG_KEY = 'chat_bot_config';

// TODO: move to utils
const loadDataFromLocalStorage = (storageKey: string, defaultData: any) => {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : defaultData;
};

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
  const { tab } = useParams();

  const { defaultAccount, accounts } = useSelector(
    (state: RootState) => state.pocket
  );
  // TODO: move 'nickname' to reducer
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [config, setConfig] = useState(WebLLMInstance.config);
  const [botList, setBotList] = useState(
    loadDataFromLocalStorage(CHAT_BOT_CONFIG_KEY, defaultBotList)
  );

  const botSelectOptions = useMemo(
    () => [
      ...Object.keys(botList).map((k) => ({ value: k, text: botList[k].name })),
    ],
    [botList]
  );
  const [selectedBotUUID, setSelectedBotUUID] = useState(
    botSelectOptions[0].value
  );

  const [inProgress, setIsProgress] = useState(false);
  const [statsText, setStatsText] = useState<string | undefined>(undefined);
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

  useEffect(() => {
    console.log('config');
  });

  const nickname = passport?.extension.nickname;
  const botName = config.name;
  const onLoadClick = () => {
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
    WebLLMInstance.chat(userMessage, async (step, message) => {
      setChatReply({ name: botName, message, date: Date.now() });
      setStatsText(await WebLLMInstance.runtimeStatsText());
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
    <main className="block-body">
      <Tablist
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
        gridGap="10px"
        marginTop={25}
        marginBottom={50}
        width="100%"
        marginX="auto"
      >
        <TabBtn text="Bot playground" isSelected={!tab} to="/chatbot" />
        <TabBtn
          text="Config"
          isSelected={tab === 'config'}
          to="/chatbot/config"
        />
      </Tablist>
      {tab === 'config' && (
        <LocalStorageAsEditableTable
          storageKey={CHAT_BOT_CONFIG_KEY}
          columns={['name', 'model_url', 'params_url']}
          defaultData={defaultBotList}
        />
      )}
      {!tab && (
        <>
          <div>
            <ContainerGradientText
              userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
            >
              <ContainerKeyValue>
                <div>Model</div>
                <Select
                  valueSelect={selectedBotUUID}
                  width="350px"
                  onChangeSelect={setSelectedBotUUID}
                  options={botSelectOptions}
                />
                <Button onClick={onLoadClick}>Load</Button>
              </ContainerKeyValue>
            </ContainerGradientText>
          </div>
          <br />
          <ContainerGradientText
            userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
          >
            <div>Chat with {botList[selectedBotUUID].name} </div>
            <div>{messagesItems}</div>
            {inProgress && <div className={styles.statsText}>{statsText}</div>}
            {inProgress && (
              <button
                type="button"
                className={styles.btnClear}
                onClick={async () => WebLLMInstance.interruptGenerate()}
              >
                ⛔️ Interrupt ⛔️
              </button>
            )}
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
        </>
      )}
    </main>
  );
}

export default ChatBotConfig;
