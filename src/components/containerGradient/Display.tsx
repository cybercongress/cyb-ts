import { ColorLamp, ContainerLamp } from './ContainerGradient';
import cx from 'classnames';

import styles from './ContainerGradient.module.scss';

type ContainerGradientText = {
  children: React.ReactNode;
  userStyleContent?: object;
  status?: ColorLamp;
  className?: string;
};

function Display({
  children,
  userStyleContent = {},
  className,
  status = 'blue',
}: ContainerGradientText) {
  return (
    <ContainerLamp style={status}>
      <div
        className={cx(styles.containerGradientText, {
          [styles.containerGradientTextPrimary]: status === 'blue',
          [styles.containerGradientTextDanger]: status === 'red',
          [styles.containerGradientTextGreen]: status === 'green',
          [styles.containerGradientTextPink]: status === 'pink',
          [styles.containerGradientTextGrey]: status === 'grey',
        })}
      >
        <div
          style={userStyleContent}
          className={cx(styles.containerGradientTextContent, className)}
        >
          {children}
        </div>
      </div>
    </ContainerLamp>
  );
}

export default Display;
