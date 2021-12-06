import React from 'react';
import { Pane, Button, Input, Text } from '@cybercongress/gravity';
import { trimString } from '../../../utils/utils';
import { STEPS } from '../utils';

const MessageItem = ({ name = '', text = '' }) => (
  <Pane
    backgroundColor="#03cba029"
    borderRadius="5px"
    paddingX={5}
    paddingY={5}
    marginY={5}
    width="70%"
    marginX="auto"
  >
    {/* <Pane overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
      {name}
    </Pane> */}
    <Pane>
      <Text color="#36d6ae">{trimString(name, 4, 4)}</Text>:{' '}
      <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
    </Pane>
  </Pane>
);

const SetUpChain = ({ configChains, onChangeInput, id }) => {
  return (
    <>
      {Object.keys(configChains[`chain${id}`]).length > 0 &&
        Object.keys(configChains[`chain${id}`]).map((key) => {
          return (
            <Input
              placeholder="rpcEndpoint"
              value={configChains[`chain${id}`][key]}
              onChange={(e) =>
                onChangeInput((items) => ({
                  ...items,
                  [configChains[`chain${id}`]]: {
                    ...configChains[`chain${id}`],
                    [key]: e.target.value,
                  },
                }))
              }
            />
          );
        })}
    </>
  );
};

const StateSetUpChain = ({ step, onChangeInput, configChains }) => {
  if (step === STEPS.ENTER_CHAIN_A) {
    return (
      <>
        <SetUpChain
          id="A"
          onChangeInput={onChangeInput}
          configChains={configChains}
        />
        <Button>Next</Button>
      </>
    );
  }

  if (step === STEPS.ENTER_CHAIN_B) {
    return (
      <>
        <SetUpChain id="A" />
        <Button>Next</Button>
      </>
    );
  }
  return null;
};

const LogRelayer = (relayerLog) => {
  console.log(`relayerLog`, relayerLog);
  return (
    <div></div>
    // <>{relayerLog && Object.keys(relayerLog).length > 0 && relayerLog.ma}</>
  );
};

const StartStopRelayer = () => {
  return <Button>Next</Button>;
};

function Relayer({ step, state }) {
  const { configChains, setConfigChains } = state;
  return (
    <>
      {step >= STEPS.RUN_RELAYER && <StartStopRelayer />}
      <LogRelayer />
      {step < STEPS.SETUP_RELAYER && (
        <div style={{ maxWidth: '400px', display: 'grid', gridGap: '15px' }}>
          <StateSetUpChain
            step={step}
            configChains={configChains}
            onChangeInput={setConfigChains}
          />
        </div>
      )}
    </>
  );
}

export default Relayer;
