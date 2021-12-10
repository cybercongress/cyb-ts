import React from 'react';
import { Pane, Button, Input, Text } from '@cybercongress/gravity';
import { trimString } from '../../../utils/utils';
import { STEPS } from '../utils';

const styleLog = {
  width: '720px',
  overflow: 'auto',
  height: '400px',
  border: '1px solid black',
  textAlign: 'left',
  padding: '5px',
};

const MessageItem = ({ text = '' }) => (
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

const SetUpChain = ({ configChains, onChangeConfigChains, id }) => {
  return (
    <>
      <hr />
      <div>chain{id}</div>
      {Object.keys(configChains[`chain${id}`]).length > 0 && (
        <>
          rpcEndpoint
          <Input
            placeholder="rpcEndpoint"
            value={configChains[`chain${id}`].rpcEndpoint}
            onChange={(e) =>
              onChangeConfigChains(id, 'rpcEndpoint', e.target.value)
            }
          />
          restEndpoint
          <Input
            placeholder="restEndpoint"
            value={configChains[`chain${id}`].restEndpoint}
            onChange={(e) =>
              onChangeConfigChains(id, 'restEndpoint', e.target.value)
            }
          />
          addrPrefix
          <Input
            placeholder="addrPrefix"
            value={configChains[`chain${id}`].addrPrefix}
            onChange={(e) =>
              onChangeConfigChains(id, 'addrPrefix', e.target.value)
            }
          />
          chainId
          <Input
            placeholder="chainId"
            value={configChains[`chain${id}`].chainId}
            onChange={(e) =>
              onChangeConfigChains(id, 'chainId', e.target.value)
            }
          />
          gasPrice
          <Input
            placeholder="gasPrice"
            value={configChains[`chain${id}`].gasPrice}
            onChange={(e) =>
              onChangeConfigChains(id, 'gasPrice', e.target.value)
            }
          />
          denom
          <Input
            placeholder="denom"
            value={configChains[`chain${id}`].denom}
            onChange={(e) => onChangeConfigChains(id, 'denom', e.target.value)}
          />
        </>
      )}
    </>
  );
};

const StateSetUpChain = ({
  step,
  onChangeConfigChains,
  configChains,
  setStep,
}) => {
  if (step === STEPS.ENTER_CHAIN_A) {
    return (
      <>
        <SetUpChain
          id="A"
          onChangeConfigChains={onChangeConfigChains}
          configChains={configChains}
        />
        <Button onClick={() => setStep(STEPS.ENTER_CHAIN_B)}>Next</Button>
      </>
    );
  }

  if (step === STEPS.ENTER_CHAIN_B) {
    return (
      <>
        <SetUpChain
          id="B"
          onChangeConfigChains={onChangeConfigChains}
          configChains={configChains}
        />
        <Button onClick={() => setStep(STEPS.SETUP_SIGNERS)}>Next</Button>
      </>
    );
  }
  return null;
};

const LogRelayer = ({ relayerLog }) => {
  // console.log(`relayerLog`, relayerLog);
  return (
    <div style={styleLog}>
      {relayerLog &&
        Object.keys(relayerLog).length > 0 &&
        relayerLog.map((item) => <MessageItem text={item} />)}
    </div>
  );
};

const StartStopRelayer = ({ step, setStep }) => {
  if (step === STEPS.RELAYER_READY || step === STEPS.STOP_RELAYER) {
    return (
      <>
        <Button onClick={() => setStep(STEPS.RUN_RELAYER)}>run</Button>
      </>
    );
  }

  if (step === STEPS.RUN_RELAYER) {
    return <Button onClick={() => setStep(STEPS.STOP_RELAYER)}>stop</Button>;
  }
  return null;
};

function Relayer({ step, state }) {
  const { configChains, onChangeConfigChains, setStep, relayerLog } = state;
  return (
    <div style={{ maxWidth: '400px' }}>
      {step === STEPS.INIT_RELAYER && (
        <>
          <Button onClick={() => setStep(STEPS.SETUP_RELAYER)}>
            setup new
          </Button>
          <Button onClick={() => setStep(STEPS.RUN_RELAYER_WITH_EXISTING)}>
            createWithExistingConnections
          </Button>
        </>
      )}
      {step >= STEPS.RELAYER_READY && (
        <div style={{ marginBottom: 20 }}>
          <StartStopRelayer step={step} setStep={setStep} />
        </div>
      )}

      {step < STEPS.SETUP_RELAYER && (
        <div style={{ maxWidth: '400px', display: 'grid', gridGap: '15px' }}>
          <StateSetUpChain
            step={step}
            configChains={configChains}
            onChangeConfigChains={onChangeConfigChains}
            setStep={setStep}
          />
        </div>
      )}
      <LogRelayer relayerLog={relayerLog} />
    </div>
  );
}

export default Relayer;
