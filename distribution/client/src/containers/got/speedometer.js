import React from 'react';

export const Speedometer = ({ colEthAtom }) => (
  <div className="wrapper-speedometer">
    <div className='ethCol' style={{height: `${colEthAtom.eth < 1 ? 1 : colEthAtom.eth}%`}} ></div>
    <div className='atomCol' style={{height: `${colEthAtom.atom < 1 ? 1 : colEthAtom.atom }%`}}></div>
    {/* <div className="speedometer">
      <div className="pointer">
        <div
          className="arow"
          style={{
            transform: ` rotate(${arow}deg)`
          }}
        />
      </div>
    </div> */}
  </div>
);
