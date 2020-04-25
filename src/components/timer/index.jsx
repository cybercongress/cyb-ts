import React, { useEffect, useState } from 'react';
import { getTimeRemaining } from '../../utils/utils';

const initialState = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const Timer = ({ updateFunc, startTime }) => {
  const [timeState, setTimeState] = useState(initialState);

  const initializeClock = endtime => {
    let timeinterval;
    const updateClock = () => {
      const t = getTimeRemaining(endtime);
      if (t.total <= 0) {
        clearInterval(timeinterval);
        if (updateFunc) {
          updateFunc();
        }
        return true;
      }
      if (t.total >= 0) {
        setTimeState({
          days: t.days,
          hours: `0${t.hours}`.slice(-2),
          minutes: `0${t.minutes}`.slice(-2),
          seconds: `0${t.seconds}`.slice(-2),
        });
      }
    };

    updateClock();
    timeinterval = setInterval(updateClock, 1000);
  };

  useEffect(() => {
    initializeClock(startTime);
  }, [startTime]);
  return (
    <div>
      <div className="countdown">
        <span className="countdown-time text-glich" data-text={timeState.days}>
          {timeState.days}
          {/* <span className="countdown-time text-glich" data-text="days">
              days
            </span> */}
        </span>
        <span className="countdown-time text-glich" data-text={timeState.hours}>
          {timeState.hours}
        </span>
        {/* <span className="countdown-time text-glich no-margin" data-text=":">
            :
          </span> */}
        <span
          className="countdown-time text-glich"
          data-text={timeState.minutes}
        >
          {timeState.minutes}
        </span>
        {/* <span className="countdown-time text-glich no-margin" data-text=":">
            :
          </span> */}
        <span
          className="countdown-time text-glich"
          data-text={timeState.seconds}
        >
          {timeState.seconds}
        </span>
      </div>
    </div>
  );
};

export default Timer;
