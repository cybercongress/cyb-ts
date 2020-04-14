import React from 'react';
import { connect } from 'react-redux';
import { CYBER } from '../../utils/config';
import { setBlock } from '../../redux/actions/block';

const { CYBER_WEBSOCKET_URL } = CYBER;

class Electricity extends React.Component {
  ws = new WebSocket(CYBER_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      d: 'M0,100,500,70',
      stage: false,
    };
    // this.run();
  }

  componentDidMount() {
    this.getDataWS();
  }

  getDataWS = () => {
    const { setBlockProps } = this.props;

    this.ws.onopen = () => {
      console.log('connected');
      this.ws.send(
        JSON.stringify({
          method: 'subscribe',
          params: ["tm.event='NewBlockHeader'"],
          id: '1',
          jsonrpc: '2.0',
        })
      );
    };
    this.ws.onmessage = async evt => {
      const message = JSON.parse(evt.data);
      if (message.result.data.value.header.height) {
        const block = message.result.data.value.header.height;
        setBlockProps(block);
      }
      this.run();
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  update = () => {
    const d = this.calculate(0, 0, 2000, 70);
    this.setState({
      d,
    });
  };

  calculate = (x, y, width, height) => {
    const points = [[x, height / 2]];
    const maxPoints = 10;
    const chunkRange = width / maxPoints;
    for (let i = 0; i < maxPoints; i++) {
      const cx = chunkRange * i + Math.cos(i) * chunkRange;
      const cy = Math.random() * height;
      points.push([cx, cy]);
    }

    points.push([width, height / 2]);

    const d = points.map(point => point.join(','));
    return `M${d.join(',')}`;
  };

  run() {
    // setInterval(() => {
    const timerId = setInterval(() => {
      this.setState({
        stage: true,
      });
      this.update();
    }, 1000 / 30);
    setTimeout(() => {
      clearInterval(timerId);
      this.setState({
        stage: false,
      });
    }, 600);
    // }, Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000);

    // const fps = 30;
    // let now;
    // let delta;
    // let then = Date.now();
    // const interval = 1000 / fps;
    // let iteration = 0;
    // const loop = () => {
    //   requestAnimationFrame(loop);

    //   now = Date.now();
    //   delta = now - then;
    //   if (delta > interval) {
    //     then = now - (delta % interval);

    //     // update stuff
    //     this.update(iteration++);
    //   }
    // };
    // loop();
  }

  render() {
    const { d, stage } = this.state;
    const { left, right } = this.props;

    return (
      <div className="electricity">
        <div className="line">
          <svg
            className="electricity-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2000 70"
          >
            <defs>
              <filter id="f1" x="0" y="0">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
              </filter>
            </defs>
            {stage && (
              <g>
                <path d={d} fill="none" stroke="#3ab793" filter="url(#f1)" />
                <path d={d} fill="none" stroke="#3ab793" />
              </g>
            )}
          </svg>
        </div>
        {/* <a href="https://cyb.ai/" target="_blank">
        <img style={{ width: 100, height: 100 }} src={cyb} />
        </a> */}
      </div>
    );
  }
}

const mapDispatchprops = dispatch => {
  return {
    setBlockProps: block => dispatch(setBlock(block)),
  };
};

export default connect(null, mapDispatchprops)(Electricity);
