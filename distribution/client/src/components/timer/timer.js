import React, { Component } from 'react';

export class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: '00',
      hours: '00',
      seconds: '00',
      minutes: '00',
      time: true
    };
  }

  getTimeRemaining = endtime => {
    const t = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      total: t,
      days,
      hours,
      minutes,
      seconds
    };
  };

  initializeClock = endtime => {
    let timeinterval;
    const updateClock = () => {
      const t = this.getTimeRemaining(endtime);
      if (t.total <= 0) {
        clearInterval(timeinterval);
        this.setState({
          time: false
        });
        return true;
      }
      this.setState({
        days: t.days,
        hours: `0${t.hours}`.slice(-2),
        minutes: `0${t.minutes}`.slice(-2),
        seconds: `0${t.seconds}`.slice(-2)
      });
      //   console.log(t.total);
      //   if (t.total <= 0) {
      //     document.getElementById("countdown").className = "hidden";
      //     document.getElementById("deadline-message").className = "visible";
      //     clearInterval(timeinterval);
      //     return true;
      //   }
      //   daysSpan.innerHTML = t.days;
      //   hoursSpan.innerHTML = ("0" + t.hours).slice(-2);
      //   minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
      //   secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
    };

    updateClock();
    timeinterval = setInterval(updateClock, 1000);
  };

  //   var resultGMT;
  //   var offset = new Date().getTimezoneOffset();
  // if(offset<0)
  //   resultGMT = "GMT+" + (offset/-60);
  // else
  //   resultGMT = "GMT-" + offset/60;

  //    var deadline="July 30 2019 12:00:00 "+ resultGMT;
  // var deadline = "January 01 2018 00:00:00 GMT+0300"; //for Ukraine
  // var deadline = new Date(Date.parse(new Date()) + 5 * 1000); // for endless timer

  componentDidMount() {
    let resultGMT;
    const offset = new Date().getTimezoneOffset();
    if (offset < 0) resultGMT = `GMT+${offset / -60}`;
    else resultGMT = `GMT-${offset / 60}`;
    const deadline = `September 30 2019 12:00:00 ${resultGMT}`;
    this.initializeClock(deadline);
  }

  render() {
    const { days, hours, seconds, minutes, time } = this.state;

    return (
      <div>
        {time && (
          <div className="countdown">
            <span
              className="countdown-time text-glich"
              data-text={days}
            >
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
        )}
      </div>
    );
  }
}
