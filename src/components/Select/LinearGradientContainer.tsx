import cx from 'classnames';
import stylesLinear from './stylesLinear.scss';

function LinearGradientContainer() {
  return (
    <div className={stylesLinear.textbox}>
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
