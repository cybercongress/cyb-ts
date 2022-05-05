import React, { useRef } from 'react';
import { ContainerGradient } from '../components';
import ContainerAvatar from '../components/avataIpfs/containerAvatar';

function Avatar({ txs, valueNickname, upload, setAvatarImg, avatar }) {
  const inputOpenFileRef = useRef();

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  const onFilePickerChange = (files) => {
    const file = files.current.files[0];
    setAvatarImg(file);
  };

  const onClickClear = () => {
    setAvatarImg(null);
  };

  return (
    <ContainerGradient txs={txs} title="Moon Citizenship">
      <div
        style={{
          paddingLeft: '15px',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={{ color: '#36D6AE' }}>{valueNickname}</div>
        {upload && (
          <ContainerAvatar>
            <input
              ref={inputOpenFileRef}
              onChange={() => onFilePickerChange(inputOpenFileRef)}
              type="file"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              style={{
                color: '#36d6ae',
                background: 'transparent',
                border: 'none',
                fontSize: '15.5px',
                cursor: 'pointer',
              }}
              // className={
              //   avatarImg !== null && avatarImg !== undefined
              //     ? 'btn-add-close'
              //     : 'btn-add-file'
              // }
              onClick={showOpenFileDlg}
            >
              upload avatar
            </button>
          </ContainerAvatar>
        )}
        {!upload && <ContainerAvatar>{avatar}</ContainerAvatar>}
      </div>
    </ContainerGradient>
  );
}

export default Avatar;
