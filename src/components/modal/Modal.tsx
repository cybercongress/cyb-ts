import Display from '../containerGradient/Display/Display';
import * as styles from './Modal.style';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export default function Modal({ isOpen, children }: ModalProps) {
  return isOpen ? (
    <>
      <div style={styles.backdrop} />
      <div style={styles.wrapper}>
        <Display>{children}</Display>
      </div>
    </>
  ) : null;
}
