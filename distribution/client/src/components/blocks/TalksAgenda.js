import React from 'react';

const timeConvert = num => {
  const hours = Math.floor(num / 3600);
  let minutes = (num % 3600) / 60;
  if (minutes < 10) minutes = `${minutes}0`;
  return `${hours}:${minutes}`;
};

const renderTalks = talks => {
  let time = 36000;
  const emptyTime = [];
  const talksWithTime = talks.map(v => {
    time += parseInt(v.duration);
    return { ...v, time };
  });
  let lastTime = parseInt(talksWithTime[talksWithTime.length - 1].time);
  if (lastTime < 63000) {
    while (lastTime < 63000) {
      lastTime += 1800;
      emptyTime.push(lastTime);
    }
  }
  const empty = emptyTime.map(t => (
    <p className="title-code padding-left-45" key={t}>
      {timeConvert(t)} - &nbsp;
    </p>
  ));
  const render = talksWithTime.map(t => (
    <p className="title-code padding-left-45" key={t.speakerNickname}>
      {timeConvert(t.time)} - {t.speakerNickname},&nbsp;
      <span className="string">{t.topic}</span>
    </p>
  ));
  return render.concat(empty);
};

export const TalksAgenda = ({ talks, dots }) => (
  <div>
    <p className="title-func" style={{ marginTop: '32px' }}>
      <span className="italic">talks </span>agenda():
    </p>
    <p className="title-code padding-left-45" style={{ marginTop: '26px' }}>
      09:00 - Dors Open
    </p>
    <p className="title-code padding-left-45">
      10:00 - Welcome Speech,&nbsp;
      <span className="string">Event DApp Intro</span>
    </p>
    {Object.keys(talks).length > 0 ? renderTalks(talks) : dots}
    <p className="title-code padding-left-45">18:00 - Networking</p>
    <p className="title-code padding-left-45">20:00 - Rave</p>
  </div>
);
