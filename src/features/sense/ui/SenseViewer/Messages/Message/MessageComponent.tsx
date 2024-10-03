import styles from './Message.module.scss';
import { LLMMessage } from 'src/features/sense/redux/sense.redux'; // Import LLMMessage

interface MessageProps {
  message: LLMMessage;
}

function MessageComponent({ message }: MessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={isUser ? styles.userMessage : styles.llmMessage}>
      <div className={styles.text}>{message.text}</div>
      <div className={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

export default MessageComponent;