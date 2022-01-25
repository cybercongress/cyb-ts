import React from 'react';
import { ContainerGradient, Signatures, ScrollableTabs } from './components';
import Input from '../teleport/components/input';

const styleSteps = { width: '120px', height: '40px' };
const items = [
  'nickname',
  'rules',
  'avatar',
  'install keplr',
  'setup keplr',
  'connect keplr',
  'passport look',
];

function PortalGift() {
  const checkKeplr = () => {
    console.log(`window.keplr `, window.keplr);
    console.log(`window.getOfflineSignerAuto`, window.getOfflineSignerAuto);
  };

  return (
    <main className="block-body">
      <div
        style={{
          width: '60%',
          margin: '0px auto',
          display: 'grid',
          gap: '70px',
        }}
      >
        <ScrollableTabs items={items} active={0}>
          {/* <div style={styleSteps}>step 1</div>
          <div style={styleSteps}>step 2</div>
          <div style={styleSteps}>step 3</div>
          <div style={styleSteps}>step 4</div>
          <div style={styleSteps}>step 5</div> */}
        </ScrollableTabs>
        <ContainerGradient>
          <div style={{ width: '160px' }}>
            <Input
              // id={id}
              // value={valueInput}
              // onChange={(e) => onChangeInput(e)}
              placeholder="choose username"
              autoComplete="off"
              textAlign="end"
              style={{ fontSize: '16px' }}
            />
          </div>
        </ContainerGradient>

        <ContainerGradient danger title="Moon Citizenship rules">
          <div style={{ paddingLeft: '15px', height: '100%' }}>
            <ol
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <li>Always remember your keys </li>
              <li>Never give your keys to anyone </li>
              <li>Learn to trust your keys to apps </li>
              <li>Always verify your keys </li>
              <li>Consider how to inherit your keys</li>
            </ol>
          </div>
        </ContainerGradient>

        <ContainerGradient title="Moon Citizenship">
          <div
            style={{
              paddingLeft: '15px',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div style={{ color: '#36D6AE' }}>~mastercyb</div>
            <div
              style={{
                width: '120px',
                height: '120px',
                border: '1px solid #36D6AE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                position: 'absolute',
                top: '-30px',
                right: '15px',
                color: '#36D6AE',
              }}
            >
              upload avatar
            </div>
          </div>
        </ContainerGradient>

        <ContainerGradient txs title="Moon Citizenship">
          <div
            style={{
              height: '100%',
              color: '#36D6AE',
            }}
          >
            <div
              style={{
                display: 'grid',
                height: '100px',
              }}
            >
              <div style={{ color: '#36D6AE' }}>~mastercyb</div>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  border: '1px solid #36D6AE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '-30px',
                  right: '15px',
                  color: '#36D6AE',
                }}
              >
                upload avatar
              </div>
            </div>
            <Signatures />
          </div>
        </ContainerGradient>

        <button type="button" onClick={() => checkKeplr()}>
          keplr
        </button>
      </div>
    </main>
  );
}

export default PortalGift;
