import React from 'react';
import { Pane } from '@cybercongress/gravity';

const mp3 = require('./starwars.mp3');
const cyberImg = require('../../image/cyber.png');
const cybImg = require('../../image/cyb.svg');

class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animated: false,
      end: false,
      cyber: false,
      cyb: false,
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

  render() {
    const { animated, end, cyber, cyb } = this.state;

    return (
      <div className="story" style={{ opacity: `${end ? 0 : 1}` }}>
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
            {cyb && <img style={{ width: 'inherit' }} alt="cyb" src={cybImg} />}
          </Pane>
        </div>
        <section
          id="title"
          style={{ opacity: `${animated ? 0 : 1}`, transition: 'opacity 0.3s' }}
        >
          <p>A long time ago somewhere in Cosmos ...</p>
        </section>

        <section className="content">
          <div id="text" className={`${animated ? 'animated' : ''}`}>
            <p>
              It is a period of digital war. The evil empire swallows the last
              unoccupied borders of the universe.
            </p>
            <p>
              Resisting rebel units consolidate all remaining energy on building a
              superintelligence, which they believe will help to stop the domination
              of the evil empire once and for all.
            </p>
            <p>
              As they begin to test the new god in the wild - an enormous, zepto amount 
              of robots emerge. It turns out Cyb robots help survey the
              universe for a bootloader of the new, yet to born, force.
            </p>
          </div>
        </section>
        <audio autoPlay id="sound" preload="auto">
          <source src={mp3} type="audio/mpeg" />
        </audio>
      </div>
    );
  }
}

export default Story;
