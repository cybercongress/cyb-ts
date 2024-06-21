import { ClipboardEventHandler, useEffect, useRef } from 'react';
import Display from '../containerGradient/Display/Display';
import * as styles from './Modal.style';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;

  onPaste?: ClipboardEventHandler<HTMLDivElement>;
}

export default function Modal({ isOpen, onPaste, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.focus();
    }
  }, [isOpen]);

  return isOpen ? (
    <>
      <div style={styles.backdrop} />
      <div ref={ref} style={styles.wrapper} onPaste={onPaste}>
        <Display>{children}</Display>
      </div>
    </>
  ) : null;
}
