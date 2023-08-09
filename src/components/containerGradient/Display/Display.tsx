import { ContainerLamp } from '../ContainerGradient';
import cx from 'classnames';

import styles from './Display.module.scss';
import DisplayTitle, {
  Props as DisplayTitleProps,
} from '../DisplayTitle/DisplayTitle';
import { ColorLamp } from '../types';

type Props = {
  children: React.ReactNode;
  userStyleContent?: object;
  status?: ColorLamp;
  color?: ColorLamp;
  className?: string;
  isVertical?: boolean;
  titleProps?: Pick<DisplayTitleProps, 'title' | 'image' | 'children'>;
};

function Display({
  children,
  titleProps,
  userStyleContent = {},
  className,
  isVertical,
  color = 'green',
  status = 'green',
}: Props) {
  return (
    <div
      className={cx(styles.wrapper, styles[color || status], {
        [styles.vertical]: isVertical,
      })}
    >
      {titleProps && (
        <header className={styles.header}>
          <DisplayTitle
            inDisplay
            title={titleProps.title}
            image={titleProps.image}
          >
            {titleProps.children}
          </DisplayTitle>
        </header>
      )}
      {children}
    </div>
  );

  // return (
  //   <ContainerLamp style={status}>
  //     <div
  //       className={cx(stylesCommon.containerGradientText, {
  //         [stylesCommon.containerGradientTextPrimary]: status === 'blue',
  //         [stylesCommon.containerGradientTextDanger]: status === 'red',
  //         [stylesCommon.containerGradientTextGreen]: status === 'green',
  //         [stylesCommon.containerGradientTextPink]: status === 'pink',
  //         [stylesCommon.containerGradientTextGrey]: status === 'grey',
  //       })}
  //     >
  //       <div
  //         style={userStyleContent}
  //         className={cx(stylesCommon.containerGradientTextContent, className)}
  //       >
  //         {titleProps && (
  //           <header className={styles.header}>
  //             <DisplayTitle
  //               inDisplay
  //               title={titleProps.title}
  //               image={titleProps.image}
  //             >
  //               {titleProps.children}
  //             </DisplayTitle>
  //           </header>
  //         )}
  //         {children}
  //       </div>
  //     </div>
  //   </ContainerLamp>
  // );
}

export default Display;
