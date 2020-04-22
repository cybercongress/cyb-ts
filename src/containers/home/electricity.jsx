import React from 'react';
import { connect } from 'react-redux';
import { CYBER } from '../../utils/config';
import { setBlock } from '../../redux/actions/block';

const { CYBER_WEBSOCKET_URL } = CYBER;

const M = Math;
const DOC = document;
let F = 0;

class Electricity extends React.Component {
  ws = new WebSocket(CYBER_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      d: 'M0,0 L240,0',
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
      if (Object.keys(message.result).length > 0) {
        const block = message.result.data.value.header.height;
        setBlockProps(block);
      }
      this.run();
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  At = (el, a, v) => {
    el.setAttribute(a, v);
  };

  R = (min, max) => {
    return M.round(min + M.random() * (max - min));
  };

  f = (p, P, d) => {
    return [(p[0] - P[0]) * d + P[0], (p[1] - P[1]) * d + P[1]];
  };

  T = () => {
    const l0 = DOC.getElementById('lightning0');
    const l1 = DOC.getElementById('lightning1');
    const l2 = DOC.getElementById('lightning2');

    const L = 2050;
    const C = this.R(30, 3);
    const PC = L / C;
    const A = [];
    const D = 10;
    let NP = 'M';
    const S = this.R(1, 3) * 0.01;
    const B = this.R(-2, 5);
    const RF = 0.4;
    const yPos = 0;

    if (this.state.stage) {
      for (let i = 0; i < C; i += 1) {
        if (i === 0) {
          A.push([i, yPos]);
        } else if (i < C / 2) {
          A.push([i * PC, this.R(-D, D) * i]);
        } else {
          A.push([i * PC, this.R(-D, D) * (C - i)]);
        }
      }
      for (let i = 0; i < C; i += 1) {
        if (i !== 0 && i !== C - 1) {
          const P = this.f(A[i - 1], A[i], RF);
          const p = this.f(A[i], A[i + 1], 1 - RF);
          NP += ` L${P[0]},${P[1]}`;
          NP += ` Q${A[i][0]},${A[i][1]}`;
          NP += ` ${p[0]},${p[1]}`;
        } else if (i === C - 1) {
          NP += ` T${L},${yPos}`;
        } else {
          NP += ` ${A[i][0]},${A[i][1]}`;
        }
      }
      // console.log(NP);
      this.At(l0, 'stroke-width', B + 12);
      this.At(l1, 'stroke-width', B + 6);
      this.At(l2, 'stroke-width', B);
      this.setState({ d: NP });
    }
    // TwL.to([l0, l1], S, { morphSVG: { d: NP } });
    // TwL.to([l2], S, { morphSVG: { d: NP }, delay: S, onComplete: T });
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
      this.T();
    }, 1000 / 30);
    setTimeout(() => {
      clearInterval(timerId);
      this.setState({
        stage: false,
      });
    }, 600);
  }

  render() {
    const { d, stage } = this.state;
    const { left, right } = this.props;

    return (
      <div className="electricity">
        <div className="line">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2050 80">
            <g id="lightningContainer">
              <rect width="2050" height="80" fill="#000000" />
              {stage && (
                <g
                  id="lightningG"
                  width="2050"
                  height="80"
                  transform="translate(0, 40)"
                  opacity="1"
                >
                  <path
                    id="lightning0"
                    stroke="rgba(0,238,255,0.1)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="12"
                    fill="none"
                    d={d}
                  />
                  <path
                    id="lightning1"
                    stroke="rgba(0,238,255,0.3)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                    fill="none"
                    d={d}
                  />
                  <path
                    id="lightning2"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    fill="none"
                    d={d}
                  />
                </g>
              )}
            </g>
          </svg>
        </div>
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
