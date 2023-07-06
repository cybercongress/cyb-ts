import React, { useState, useEffect } from 'react';
import { Pill } from '@cybercongress/gravity';
import { Tooltip } from 'src/components';
import { Link } from 'react-router-dom';
import styles from './ChatBotPanel.module.scss';
import { WebLLMInstance } from 'src/services/scripting/webLLM';

function ChatBotPanel() {
  const [isChatBotActive, setIsChatBotActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const swichActive = () => {
    setIsChatBotActive((isChatBotActive) => !isChatBotActive);
  };

  useEffect(() => {
    if (isChatBotActive) {
      WebLLMInstance.load(({ progress }) => setProgress(progress));
    } else {
      WebLLMInstance.unload();
    }
  }, [isChatBotActive]);

  return (
    <div className={styles.chatBot}>
      <div className={styles.panel}>
        <Tooltip placement="bottom" tooltip="Click to edit bot config">
          <Link to="/chatbot" className={styles.titleButton}>
            Chat bot
          </Link>
        </Tooltip>
        <Pill marginLeft={10} active={isChatBotActive} onClick={swichActive}>
          {isChatBotActive ? 'On' : 'Off'}
        </Pill>
      </div>
      {isChatBotActive && progress < 1 && (
        <div className={styles.progressTitle}>{`Loading: ${Math.round(
          progress * 100
        )}%`}</div>
      )}
      <div className={styles.pluginsButton}>
        <Tooltip placement="bottom" tooltip="Click to edit plugins">
          <Link to="/plugins" className={styles.titleButton}>
            <span>🔌 </span>Plugins
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}

export default ChatBotPanel;
