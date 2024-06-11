import React from 'react';
import Popper, { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import cx from 'classnames';

import { PositioningStrategy } from '@popperjs/core';
import styles from './Tooltip.module.scss';

export type TooltipProps = {
  children: React.ReactNode;
  trigger?: 'click' | 'hover';
  tooltip: React.ReactNode;
  hideBorder?: boolean;
  placement?: Popper.Config['placement'];
  contentStyle?: React.CSSProperties;

  /**
   * @deprecated not use
   */
  strategy?: PositioningStrategy;
};

function Tooltip({
  children,
  trigger = 'hover',
  tooltip,
  hideBorder = true,
  contentStyle = {},
  strategy = 'absolute',
  placement = 'top',
}: TooltipProps) {
  const [mounted, setMounted] = React.useState(false);

  const setMountedOnceVisible = (visibleArg: boolean) => {
    if (!mounted && visibleArg) {
      setMounted(true);
    }
  };

  const { visible, getTooltipProps, setTooltipRef, setTriggerRef } =
    usePopperTooltip(
      {
        trigger,
        delayHide: 100,
        interactive: true,
        onVisibleChange: setMountedOnceVisible,
        placement,
      },
      {
        strategy,
      }
    );

  return (
    <>
      <div ref={setTriggerRef} style={contentStyle}>
        {children}
      </div>

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
