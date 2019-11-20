import React from 'react';

const mp3 = require('./starwars.mp3');

class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animated: false,
    };
  }

  componentDidMount() {
    const { close } = this.props;
    const sound = document.getElementById('sound');

    const audioState = setInterval(() => {
      if (sound.readyState === 4) {
        this.audio();
        clearInterval(audioState);
      }
    }, 200);
    // this.fadeAudio();
    setTimeout(() => {
      this.setState({
        animated: true,
      });
    }, 6000);

    setTimeout(() => {
      close();
      localStorage.setItem('story', JSON.stringify(true));
    }, 70000);
  }

  audio = () => {
    const sound = document.getElementById('sound');
    sound.volume = 0.2;
    const fade = setInterval(() => {
      if (sound.currentTime >= 55 && sound.volume >= 0.1) {
        sound.volume -= 0.001;
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
    const { animated } = this.state;
    return (
      <div className="story">
        <div id="info">
          Star Wars opening crawl recreated in HTML, CSS & JS by{' '}
          <a href="http://github.com/charliegerard">Charlie Gerard</a>
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
              Resisting rebel units consolidate remaining energy on building
              superintelligence which they believe will help to stop domination
              by evil empire.
            </p>
            <p>
              Once they start to test the new god in the wild enormous amount of
              zepto robots emerge. It turns out Cyb robots help survey the
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
