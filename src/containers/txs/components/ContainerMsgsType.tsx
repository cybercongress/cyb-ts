import { MsgType } from 'src/components';
import { ReactNode } from 'react';
import styles from './ContainerMsgsType.module.scss';
import { RowsContainer } from '../../../components/Row/Row';

function ContainerMsgsType({
  type,
  children,
}: {
  type: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.type}>
        Type: <MsgType type={type} />
      </div>
      <RowsContainer>{children}</RowsContainer>
    </div>
  );
}

export default ContainerMsgsType;
