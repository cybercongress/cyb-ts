import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CYBER } from '../../utils/config';
import { setBlock } from '../../redux/actions/block';

const M = Math;
const DOC = document;

function Electricity({ setBlockProps }) {
  const [data, setData] = useState('M0,0 L240,0');
  const [stage, setStage] = useState(false);
  const [wsClient, setWsClient] = useState(null);

  useEffect(() => {
    let ws = null;
    const closeHandler = () => {
      console.log(`close WS`);
      setTimeout(createConnect, 7000);
    };

    const createConnect = () => {
      if (ws !== null) {
        ws.removeEventListener('close', closeHandler);
      }
      ws = new WebSocket(CYBER.CYBER_WEBSOCKET_URL);
      ws.addEventListener('close', closeHandler);
      console.log(`open`);
      setWsClient(ws);
    };
    createConnect();

    return () => {
      ws.removeEventListener('close', closeHandler);
      ws.close();
    };
  }, []);

  useEffect(() => {
    const handlerOpen = () => {
      wsClient.send(
        JSON.stringify({
          method: 'subscribe',
          params: ["tm.event='NewBlockHeader'"],
          id: '1',
          jsonrpc: '2.0',
        })
      );
    };

    if (wsClient !== null) {
      wsClient.addEventListener('open', handlerOpen);
    }

    return () => {
      if (wsClient !== null) {
        wsClient.removeEventListener('close', handlerOpen);
      }
    };
  }, [wsClient]);

  useEffect(() => {
    const handlerMessage = (evt) => {
      const message = JSON.parse(evt.data);
      if (Object.keys(message.result).length > 0) {
        const block = message.result.data.value.header.height;
        setBlockProps(block);
        run();
      }
    };

    if (wsClient !== null) {
      wsClient.addEventListener('message', handlerMessage);
    }

    return () => {
      if (wsClient !== null) {
        wsClient.removeEventListener('message', handlerMessage);
      }
    };
  }, [wsClient]);

  const At = (el, a, v) => {
    try {
      el.setAttribute(a, v);
    } catch (error) {
      console.error(error);
    }
  };

  const R = (min, max) => {
    return M.round(min + M.random() * (max - min));
  };

  const f = (p, P, d) => {
    return [(p[0] - P[0]) * d + P[0], (p[1] - P[1]) * d + P[1]];
  };

  const T = () => {
    const l0 = DOC.getElementById('lightning0');
    const l1 = DOC.getElementById('lightning1');
    const l2 = DOC.getElementById('lightning2');

    const L = 2050;
    const C = R(9, 10);
    const PC = L / C;
    const A = [];
    const D = 10;
    let NP = 'M';
    const B = R(-2, 5);
    const RF = 0.4;
    const yPos = 15;

    for (let i = 0; i < C; i += 1) {
      if (i === 0) {
        A.push([i, yPos]);
      } else if (i < C / 2) {
        A.push([i * PC, R(-D, D) * i]);
      } else {
        A.push([i * PC, R(-D, D) * (C - i)]);
      }
    }
    for (let i = 0; i < C; i += 1) {
      if (i !== 0 && i !== C - 1) {
        const P = f(A[i - 1], A[i], RF);
        const p = f(A[i], A[i + 1], 1 - RF);
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
    At(l0, 'stroke-width', B + 12);
    At(l1, 'stroke-width', B + 6);
    At(l2, 'stroke-width', B);
    setData(NP);
    // TwL.to([l0, l1], S, { morphSVG: { d: NP } });
    // TwL.to([l2], S, { morphSVG: { d: NP }, delay: S, onComplete: T });
  };

  const run = () => {
    // setInterval(() => {
    const timerId = setInterval(() => {
      setStage(true);
      T();
    }, 1000 / 30);
    setTimeout(() => {
      clearInterval(timerId);
      setStage(false);
    }, 600);
  };

  return (
    <div
      style={{
        zIndex: '-1',
        width: '100%',
        padding: ' 0 20px',
        position: 'absolute',
        opacity: 0.5,
      }}
      className="electricity"
    >
      <div className="line">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2050 80">
          <g id="lightningContainer">
            <rect
              width="2050"
              height="80"
              fill="#000000"
              id="electricityLineRect"
            />
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
                  d={data}
                />
                <path
                  id="lightning1"
                  stroke="rgba(0,238,255,0.3)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="5"
                  fill="none"
                  d={data}
                />
                <path
                  id="lightning2"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  fill="none"
                  d={data}
                />
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}

const mapDispatchprops = (dispatch) => {
  return {
    setBlockProps: (block) => dispatch(setBlock(block)),
  };
};

export default connect(null, mapDispatchprops)(Electricity);
