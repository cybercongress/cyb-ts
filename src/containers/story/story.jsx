import React from 'react';
import LocalizedStrings from 'react-localization';
import { Pane } from '@cybercongress/gravity';
import { i18n } from '../../i18n/en';

const mp3 = require('./starwars.mp3');
const cyberImg = require('../../image/cyber.png');
const cybImg = require('../../image/cyb.svg');

const T = new LocalizedStrings(i18n);

class Story extends React.Component {
  constructor(props) {
    super(props);
    let story = false;
    const localStorageStory = localStorage.getItem('story');
    if (localStorageStory !== null) {
      story = localStorageStory;
    }
    this.state = {
      animated: false,
      end: false,
      cyber: false,
      cyb: false,
      story,
    };
  }

  componentDidMount() {
    const { history } = this.props;

    const sound = document.getElementById('sound');

    const audioState = setInterval(() => {
      if (sound.readyState === 4) {
        this.audio();
        clearInterval(audioState);
      }
    }, 200);
    // // this.fadeAudio();
    setTimeout(() => {
      console.log('sdf');
      this.setState({
        animated: true,
      });
    }, 6000);

    setTimeout(() => {
      this.setState({
        cyber: true,
      });
    }, 23000);

    setTimeout(() => {
      this.setState({
        cyb: true,
      });
    }, 40500);

    setTimeout(() => {
      this.setState({
        end: true,
      });
    }, 68500);

    setTimeout(() => {
      localStorage.setItem('story', JSON.stringify(true));
      history.push('/');
    }, 70000);
  }

  audio = () => {
    const sound = document.getElementById('sound');
    sound.volume = 0.2;
    const fade = setInterval(() => {
      if (sound.currentTime >= 55 && sound.volume >= 0.1) {
        sound.volume -= 0.002;
      }
      if (sound.currentTime >= 10 && sound.volume <= 0.1) {
        sound.volume = 0.0;
      }
      if (sound.volume === 0.0) {
        clearInterval(fade);
      }
    }, 200);
  };

  Play = () => {
    document.getElementById('sound').play();
  };

  render() {
    const { animated, end, cyber, cyb, story } = this.state;

    return (
      <div className="story" style={{ opacity: `${end ? 0 : 1}` }}>
        {/* <button type="button" onClick={() => this.Play()}>btn</button> */}
        {!story && (
          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className="container-distribution"
          >
            <Pane
              width={50}
              // height={50}
              position="relative"
              display="flex"
              align-items="flex-end"
            >
              {cyber && (
                <img style={{ width: 'inherit' }} alt="cyb" src={cyberImg} />
              )}
            </Pane>
            <Pane
              width={50}
              // height={50}
              position="relative"
              display="flex"
              align-items="flex-end"
            >
              {cyb && (
                <img style={{ width: 'inherit' }} alt="cyb" src={cybImg} />
              )}
            </Pane>
          </div>
        )}
        <section
          id="title"
          style={{ opacity: `${animated ? 0 : 1}`, transition: 'opacity 0.3s' }}
        >
          <p>A long time ago somewhere in Cosmos ...</p>
        </section>

        <section className="content">
          <div id="text" className={`${animated ? 'animated' : ''}`}>
            <p>{T.story.itIsAPeriod}</p>
            <p>{T.story.resistingRebel}</p>
            <p>{T.story.asTheyBegin}</p>
          </div>
        </section>
        <audio id="sound" preload="auto">
          <source src={mp3} type="audio/mpeg" />
        </audio>
      </div>
    );
  }
}

export default Story;
