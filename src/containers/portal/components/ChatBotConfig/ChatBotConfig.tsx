import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
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
import { WebLLMInstance } from 'src/services/scripting/webLLM';
import { KeyValueString, TabularKeyValues } from 'src/types/data';
import EditableTable from 'src/components/EditableTable/EditableTable';
import {
  setChatBotList,
  setChatBotActive,
  setChatBotName,
} from 'src/redux/features/scripting';
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
  const dispatch = useDispatch();
  const {
    chatBotList,
    active,
    name: botName,
    status,
    loadProgress,
  } = useSelector((store: RootState) => store.scripting.chatBot);

  const { tab } = useParams();

  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  // TODO: move 'nickname' to reducer
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [currentBotName, setCurrentBotName] = useState(botName);

  const botSelectOptions = useMemo(
    () => [
      ...Object.values(chatBotList).map((k) => ({
        value: k.name,
        text: k.name,
      })),
    ],
    [chatBotList]
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

  const onSaveConfig = (botList: TabularKeyValues) => {
    dispatch(setChatBotList(botList));
  };

  const nickname = passport?.extension.nickname;
  const onLoadClick = () => {
    dispatch(setChatBotActive(true));
    dispatch(setChatBotName(currentBotName));
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
        <EditableTable
          data={chatBotList}
          columns={['name', 'model_url', 'params_url']}
          onSave={onSaveConfig}
        />
      )}
      {!tab && (
        <>
          <div>
            <ContainerGradientText
              userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
            >
              <div className={styles.botPanelItem}>
                <div>
                  Current: <strong>{botName}</strong>
                </div>
                <div>
                  {status === 'loading'
                    ? ` (loading: ${Math.round(loadProgress * 100)}%)`
                    : status}
                </div>
              </div>
              <div className={styles.botPanelItem}>
                <div className={styles.selectWrapper}>
                  <Select
                    valueSelect={currentBotName}
                    width="100%"
                    onChangeSelect={setCurrentBotName}
                    options={botSelectOptions}
                  />
                </div>
                <div>
                  <button
                    className={styles.btnLoad}
                    type="button"
                    onClick={onLoadClick}
                  >
                    reload
                  </button>
                </div>
              </div>
            </ContainerGradientText>
          </div>
          <br />
          <ContainerGradientText
            userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
          >
            <div>
              {active ? `💬 Chat with ${botName}` : `💤 ${botName} is inactive`}{' '}
            </div>
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

            <Button onClick={onMessage} disabled={inProgress || !active}>
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
