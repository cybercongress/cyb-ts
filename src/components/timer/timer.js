import React, { Component } from 'react';

export const Timer = ({ days, hours, seconds, minutes, time }) => {
  return (
    <div>
      <div className="countdown">
        <span className="countdown-time text-glich" data-text={days}>
          {days}
          {/* <span className="countdown-time text-glich" data-text="days">
              days
            </span> */}
        </span>
        <span className="countdown-time text-glich" data-text={hours}>
          {hours}
        </span>
        {/* <span className="countdown-time text-glich no-margin" data-text=":">
            :
          </span> */}
        <span className="countdown-time text-glich" data-text={minutes}>
          {minutes}
        </span>
        {/* <span className="countdown-time text-glich no-margin" data-text=":">
            :
          </span> */}
        <span className="countdown-time text-glich" data-text={seconds}>
          {seconds}
        </span>
      </div>
    </div>
  );
};
