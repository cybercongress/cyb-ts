import React, { useState, useEffect } from 'react';
import { Tooltip } from 'src/components';
import { Link } from 'react-router-dom';
import styles from './ChatBotPanel.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/redux/store';

import { setChatBotActive } from 'src/redux/features/scripting';
import Switch from 'src/components/Switch/Switch';

function ChatBotPanel() {
  const dispatch = useDispatch();
  const {
    active,
    name: botName,
    status,
    loadProgress,
  } = useSelector((store: RootState) => store.scripting.chatBot);

  const swichActive = () => {
    dispatch(setChatBotActive(!active));
  };

  return (
    <div className={styles.chatBot}>
      <Switch
        isOn={active}
        onToggle={swichActive}
        label={
          <Tooltip placement="bottom" tooltip="Click to edit bot config">
            <Link to="/chatbot" className={styles.titleButton}>
              Chat bot
            </Link>
          </Tooltip>
        }
      />
      {/* <Pill marginLeft={10} active={active} onClick={swichActive}>
          {active ? 'on' : 'off'}
        </Pill> */}
      {active && loadProgress < 1 && (
        <div className={styles.progressTitle}>{`Loading: ${Math.round(
          loadProgress * 100
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
