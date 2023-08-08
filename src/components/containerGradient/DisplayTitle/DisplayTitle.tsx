import classNames from 'classnames';
import { ContainerLampBefore } from '../ContainerGradient';
import styles from './DisplayTitle.module.scss';

// type PickedColors = ;

export type Props = {
  title: string;

  children?: React.ReactNode;
  // temp prop
  animationState?: string;

  // to remove padding
  inDisplay?: boolean;

  color?: 'red' | 'grey' | 'blue' | 'yellow';
  image?: {
    src?: string;
    content?: React.ReactNode;
    alt?: string;
    isLarge?: boolean;
  };
};

// need split this component
function DisplayTitle({
  title,
  animationState: state = 'entered',
  image,
  children,
  inDisplay,
  color: styleLampTitle,
}: Props) {
  const content = (
    <ContainerLampBefore style={styleLampTitle}>
      <div
        className={classNames(styles.displayTitle, {
          [styles.displayTitleDanger]: styleLampTitle === 'red',
          [styles.displayTitleBlue]: styleLampTitle === 'blue',
          [styles.displayTitleYellow]: styleLampTitle === 'yellow',
        })}
      >
        <div
          className={classNames(
            styles.displayTitleContent,
            styles[`displayTitleContent${state}`]
          )}
        >
          {image && image.src ? (
            <img
              src={image.src}
              alt={image.alt}
              className={classNames(styles.titleImage, {
                [styles.big]: image.isLarge,
              })}
            />
          ) : (
            image?.content
          )}

          {title}

          {children}
        </div>
      </div>
    </ContainerLampBefore>
  );

  if (inDisplay) {
    return <div className={styles.noPaddingWrapper}>{content}</div>;
  }

  return content;
}

export default DisplayTitle;
