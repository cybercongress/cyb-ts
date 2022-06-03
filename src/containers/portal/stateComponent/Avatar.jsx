import React, { useCallback, useRef } from 'react';
import { ContainerGradient } from '../components';
import ContainerAvatar, {
  ButtonContainerAvatar,
} from '../components/avataIpfs/containerAvatar';

function Avatar({
  txs,
  valueNickname,
  upload,
  setAvatarImg,
  avatar,
  fncClearAvatar,
}) {
  const inputOpenFileRef = useRef();

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  const onFilePickerChange = (files) => {
    const file = files.current.files[0];
    setAvatarImg(file);
  };

  const onClickClear = () => {
    if (fncClearAvatar) {
      fncClearAvatar();
    }
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
            <ButtonContainerAvatar onClick={showOpenFileDlg}>
              <span>upload avatar</span>
            </ButtonContainerAvatar>
          </ContainerAvatar>
        )}
        {!upload && (
          <ContainerAvatar>
            <input
              ref={inputOpenFileRef}
              onChange={() => onFilePickerChange(inputOpenFileRef)}
              type="file"
              style={{ display: 'none' }}
            />
            <ButtonContainerAvatar uploadNew onClick={showOpenFileDlg}>
              {avatar}
            </ButtonContainerAvatar>
          </ContainerAvatar>
        )}
      </div>
    </ContainerGradient>
  );
}

export default Avatar;
