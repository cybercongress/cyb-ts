/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import QRCode from 'qrcode.react';
import { Pane } from '@cybercongress/gravity';
import { trimString } from '../../utils/utils';
import { Copy } from '../../components';

function PopapAddress({ address, onClickPopapAdress }) {
  return (
    <Pane
      width="100vw"
      height="calc(100vh - 162px)"
      position="absolute"
      zIndex={2}
      backgroundColor="#020202ba"
      id="popapAdress"
    >
      <Pane
        width="350px"
        height="200px"
        boxShadow="0 0 6px 1px #3ab793"
        position="absolute"
        zIndex={2}
        backgroundColor="#000"
        right="50%"
        transform="translate(50%, -20%)"
        borderRadius="10px"
        top="20%"
        paddingX={20}
        paddingY={20}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <button
          type="button"
          style={{
            height: '17px',
            width: '17px',
            position: 'absolute',
            top: '6px',
            right: '0',
          }}
          className="btn-add-close"
          onClick={onClickPopapAdress}
        />
        <Pane>
          {trimString(address, 10, 7)}
          <Copy text={address} />
        </Pane>
        <QRCode
          size={128}
          bgColor="#000"
          fgColor="#3ab793"
          level="L"
          includeMargin
          renderAs="svg"
          value={address}
        />
      </Pane>
    </Pane>
  );
}

export default PopapAddress;
