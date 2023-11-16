import { Pane } from '@cybercongress/gravity';

const styleLog = {
  width: '720px',
  // overflow: 'auto',
  height: '400px',
  border: '1px solid black',
  textAlign: 'left',
  padding: '5px',
};

function MessageItem({ text = '' }) {
  return (
    <Pane
      backgroundColor="#03cba029"
      borderRadius="5px"
      paddingX={5}
      paddingY={5}
      marginY={5}
      width="70%"
      marginX={5}
    >
      {/* <Pane overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
      {name}
    </Pane> */}
      <Pane>
        <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
      </Pane>
    </Pane>
  );
}

function LogRelayer({ relayerLog }) {
  return (
    <div style={styleLog}>
      {relayerLog &&
        Object.keys(relayerLog).length > 0 &&
        relayerLog.map((item, i) => <MessageItem text={item} key={i} />)}
    </div>
  );
}

export default LogRelayer;
