import React from 'react';
import { Outlet } from 'react-router-dom';
import { useCybernet } from '../../cybernet.context';
import Display from 'src/components/containerGradient/Display/Display';
import { MainContainer } from 'src/components';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';

function Verse() {
  const { selectedContract } = useCybernet();
  return (
    <>
      {/* <div
        style={{
          maxWidth: '62%',
        }}
      >
        <Display>
          <p>{JSON.stringify(selectedContract?.metadata)}</p>
          <AvataImgIpfs cidAvatar={selectedContract?.metadata?.logo} />
        </Display>
      </div> */}
      <Outlet />
    </>
  );
}

export default Verse;
