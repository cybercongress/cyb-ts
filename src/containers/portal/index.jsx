import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { ContainerGradient, Signatures, ScrollableTabs } from './components';
import Input from '../teleport/components/input';
import { AppContext } from '../../context';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { activePassport } from './utils';
import PasportCitizenship from './pasport';
import GetCitizenship from './citizenship';

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

const STAGE_LOADING = 0;
const STAGE_INIT = 1;
const STAGE_READY = 2;

function PortalGift({ defaultAccount }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [stagePortal, setStagePortal] = useState(STAGE_LOADING);

  console.log('addressActive', addressActive);

  useEffect(() => {
    const getPasport = async () => {
      if (jsCyber !== null) {
        if (addressActive !== null) {
          const response = await activePassport(jsCyber, addressActive.bech32);
          if (response !== null) {
            console.log('response', response);
            setStagePortal(STAGE_READY);
          } else {
            setStagePortal(STAGE_INIT);
          }
        } else {
          setStagePortal(STAGE_INIT);
        }
      } else {
        setStagePortal(STAGE_LOADING);
      }
    };
    getPasport();
  }, [jsCyber, keplr, addressActive]);

  const checkKeplr = () => {
    console.log(`window.keplr `, window.keplr);
    console.log(`window.getOfflineSignerAuto`, window.getOfflineSignerAuto);
  };

  if (stagePortal === STAGE_LOADING) {
    return <div>...</div>;
  }

  if (stagePortal === STAGE_INIT) {
    return <GetCitizenship />;
  }

  if (stagePortal === STAGE_READY) {
    return <PasportCitizenship />;
  }

  return null;

  // return (
  //   <main className="block-body">
  //     <div
  //       style={{
  //         width: '60%',
  //         margin: '0px auto',
  //         display: 'grid',
  //         gap: '70px',
  //       }}
  //     >
  //       <ScrollableTabs items={items} active={0}>
  //         {/* <div style={styleSteps}>step 1</div>
  //         <div style={styleSteps}>step 2</div>
  //         <div style={styleSteps}>step 3</div>
  //         <div style={styleSteps}>step 4</div>
  //         <div style={styleSteps}>step 5</div> */}
  //       </ScrollableTabs>

  //       <ContainerGradient title="Welcome to Immigration!">
  //         <div
  //           style={{
  //             textAlign: 'center',
  //             padding: '10px 50px 0px 50px',
  //             gap: 20,
  //             display: 'grid',
  //           }}
  //         >
  //           <div>My name is Cyb.</div>
  //           <div>
  //             I can help you to recieve Moon Citizenship in 7 simple steps.
  //           </div>
  //           <div>Also I have a gift for you if you tried hard!</div>
  //         </div>
  //       </ContainerGradient>

  //       <ContainerGradient>
  //         <div style={{ width: '160px' }}>
  //           <Input
  //             // id={id}
  //             // value={valueInput}
  //             // onChange={(e) => onChangeInput(e)}
  //             placeholder="choose username"
  //             autoComplete="off"
  //             textAlign="end"
  //             style={{ fontSize: '16px' }}
  //           />
  //         </div>
  //       </ContainerGradient>

  //       <ContainerGradient danger title="Moon Citizenship rules">
  //         <div style={{ paddingLeft: '15px', height: '100%' }}>
  //           <ol
  //             style={{
  //               display: 'flex',
  //               flexDirection: 'column',
  //               justifyContent: 'space-between',
  //               height: '100%',
  //             }}
  //           >
  //             <li>Always remember your keys </li>
  //             <li>Never give your keys to anyone </li>
  //             <li>Learn to trust your keys to apps </li>
  //             <li>Always verify your keys </li>
  //             <li>Consider how to inherit your keys</li>
  //           </ol>
  //         </div>
  //       </ContainerGradient>

  //       <ContainerGradient title="Moon Citizenship">
  //         <div
  //           style={{
  //             paddingLeft: '15px',
  //             height: '100%',
  //             display: 'grid',
  //             gridTemplateColumns: '1fr 1fr',
  //           }}
  //         >
  //           <div style={{ color: '#36D6AE' }}>~mastercyb</div>
  //           <div
  //             style={{
  //               width: '120px',
  //               height: '120px',
  //               border: '1px solid #36D6AE',
  //               display: 'flex',
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //               borderRadius: '50%',
  //               position: 'absolute',
  //               top: '-30px',
  //               right: '15px',
  //               color: '#36D6AE',
  //             }}
  //           >
  //             upload avatar
  //           </div>
  //         </div>
  //       </ContainerGradient>

  //       <ContainerGradient txs title="Moon Citizenship">
  //         <div
  //           style={{
  //             height: '100%',
  //             color: '#36D6AE',
  //           }}
  //         >
  //           <div
  //             style={{
  //               display: 'grid',
  //               height: '100px',
  //             }}
  //           >
  //             <div style={{ color: '#36D6AE' }}>~mastercyb</div>
  //             <div
  //               style={{
  //                 width: '120px',
  //                 height: '120px',
  //                 border: '1px solid #36D6AE',
  //                 display: 'flex',
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //                 borderRadius: '50%',
  //                 position: 'absolute',
  //                 top: '-30px',
  //                 right: '15px',
  //                 color: '#36D6AE',
  //               }}
  //             >
  //               upload avatar
  //             </div>
  //           </div>
  //           <Signatures />
  //         </div>
  //       </ContainerGradient>

  //       <button type="button" onClick={() => checkKeplr()}>
  //         keplr
  //       </button>
  //     </div>
  //   </main>
  // );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(PortalGift);
