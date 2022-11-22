import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

const Tooltip = ({ children, tooltip, hideArrow, placement, ...props }) => {
  const [mounted, setMounted] = React.useState(false);

  const setMountedOnceVisible = (visibleArg) => {
    if (!mounted && visibleArg) {
      setMounted(true);
    }
  };

  const {
    visible,
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
  } = usePopperTooltip({
    trigger: 'hover',
    delayHide: 100,
    interactive: true,
    onVisibleChange: setMountedOnceVisible,
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
            className: 'tooltip-container',
            style: visible
              ? { visibility: 'visible' }
              : { visibility: 'hidden', pointerEvents: 'none' },
          })}
        >
          <div
            {...getArrowProps({
              className: 'tooltip-arrow',
              'data-placement': placement,
            })}
          />
          {tooltip && <>{tooltip}</>}
        </div>
      )}
    </>
  );
};

export default Tooltip;
