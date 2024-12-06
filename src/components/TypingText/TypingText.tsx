import { FC, useEffect, useState } from 'react';

export interface TypingTextProps {
  content: string;
  delay?: number;
}

export const TypingText: FC<TypingTextProps> = ({ content, delay = 40 }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [content, currentIndex, delay]);

  return <span>{displayedContent}</span>;
}; 