import cx from 'classnames';
import stylesLinear from './stylesLinear.scss';

function LinearGradientContainer({ children, ...props }) {
  return (
    <div className={stylesLinear.textbox} {...props}>
      <div
        className={cx(
          stylesLinear.textboxFace,
          stylesLinear.textboxBottomGradient
        )}
      />
      <div
        className={cx(stylesLinear.textboxFace, stylesLinear.textboxBottomLine)}
      />
    </div>
  );
}

export default LinearGradientContainer;
