import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import styles from './styles.scss';

const cx = require('classnames');

const Tooltip = ({
  children,
  trigger,
  tooltip,
  hideBorder,
  placement,
  ...props
}) => {
  const [mounted, setMounted] = React.useState(false);

  const setMountedOnceVisible = (visibleArg) => {
    if (!mounted && visibleArg) {
      setMounted(true);
    }
  };

  const { visible, getTooltipProps, setTooltipRef, setTriggerRef } =
    usePopperTooltip({
      trigger: trigger || 'hover',
      delayHide: 100,
      interactive: true,
      onVisibleChange: setMountedOnceVisible,
      placement,
    });

  return (
    <>
      <span ref={setTriggerRef} className="trigger">
        {children}
      </span>

      {mounted && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: cx(styles.tooltipContainer, {
              [styles.tooltipContainerBorderNone]: hideBorder,
            }),
            style: visible
              ? { visibility: 'visible' }
              : { visibility: 'hidden', pointerEvents: 'none' },
          })}
        >
          {/* <div
            {...getArrowProps({
              className: 'tooltip-arrow',
              'data-placement': placement,
            })}
          /> */}
          {tooltip && <>{tooltip}</>}
        </div>
      )}
    </>
  );
};

export default Tooltip;
