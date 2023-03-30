import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import cx from 'classnames';

import styles from './styles.scss';

type TooltipProps = {
  children: React.ReactNode;
  trigger?: 'click' | 'hover';
  tooltip: React.ReactNode;
  hideBorder?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

function Tooltip({
  children,
  trigger = 'hover',
  tooltip,
  hideBorder = true,
  placement = 'top',
}: TooltipProps) {
  const [mounted, setMounted] = React.useState(false);

  const setMountedOnceVisible = (visibleArg: boolean) => {
    if (!mounted && visibleArg) {
      setMounted(true);
    }
  };

  const { visible, getTooltipProps, setTooltipRef, setTriggerRef } =
    usePopperTooltip({
      trigger,
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
          {tooltip}
        </div>
      )}
    </>
  );
}
export default Tooltip;
