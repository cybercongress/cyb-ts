import { useEffect, useState } from 'react';
import { ActionBar, Button, Input } from 'src/components';
// Import necessary hooks and types
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  createLLMThread,
  addLLMMessageToThread,
  replaceLastLLMMessageInThread,
} from 'src/features/sense/redux/sense.redux';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique thread IDs
import styles from './ActionBar.module.scss';
import { llmRequest } from "../../../../containers/Search/LLMSpark/LLMSpark"; // Import styles

function ActionBarLLM() {
  const [text, setText] = useState('');
  const currentThreadId = useAppSelector((state) => state.sense.llm.currentThreadId);
  const dispatch = useAppDispatch();

  const sendMessage = async () => {
    if (!text.trim()) return;

    let threadId = currentThreadId;
    if (!threadId) {
      // Create new thread if none selected
      threadId = uuidv4();
      dispatch(createLLMThread({ id: threadId }));
    }

    // Add user's message to the thread
    const userMessage = {
      text,
      sender: 'user',
      timestamp: Date.now(),
    };
    dispatch(addLLMMessageToThread({ threadId, message: userMessage }));

    // Clear the input field
    setText('');

    // Add "waiting..." message
    const waitingMessage = {
      text: 'waiting...',
      sender: 'llm',
      timestamp: Date.now(),
    };
    dispatch(addLLMMessageToThread({ threadId, message: waitingMessage }));

    // Send message to LLM API
    try {
      const responseText = await llmRequest(text);

      // Replace "waiting..." message with the actual response
      const llmMessage = {
        text: responseText,
        sender: 'llm',
        timestamp: Date.now(),
      };
      dispatch(replaceLastLLMMessageInThread({ threadId, message: llmMessage }));
    } catch (error) {
      // Handle error: Remove the "waiting..." message
      dispatch(replaceLastLLMMessageInThread({
        threadId,
        message: {
          text: 'Error: Failed to get response.',
          sender: 'llm',
          timestamp: Date.now(),
        },
      }));
      console.error('LLM request failed:', error);
    }
  };

  return (
    <ActionBar>
      <Input
        placeholder="Ask the model"
        value={text}
        onChange={(e) => setText(e.target.value)}
        // Add styling if needed
        className={styles.input}
      />
      <Button onClick={sendMessage}>
        Send
      </Button>
    </ActionBar>
  );
}

export default ActionBarLLM;