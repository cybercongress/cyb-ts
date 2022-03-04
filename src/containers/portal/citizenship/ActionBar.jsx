/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  ActionBar as ActionBarContainer,
  Button,
  Pane,
} from '@cybercongress/gravity';
import { ActionBarSteps } from '../../energy/component/actionBar';
import { ActionBarContentText, Dots } from '../../../components';

const STEP_INIT = 0;
const STEP_NICKNAME = 1;
const STEP_RULES = 2;
const STEP_AVATAR_UPLOAD = 3.1;
const STEP_AVATAR = 3.2;
const STEP_KEPLR_INIT = 4.1;
const STEP_KEPLR_SETUP = 4.2;
const STEP_KEPLR_CONNECT = 4.3;
const STEP_KEPLR_REGISTER = 5;

function ActionBar({
  step,
  setStep,
  setupNickname,
  setAvatarImg,
  avatarImg,
  uploadAvatarImg,
  avatarIpfs,
  onClickRegister,
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
    setAvatarImg(null);
  };

  if (step === STEP_INIT) {
    return (
      <ActionBarContainer>
        <Button onClick={() => setStep(STEP_NICKNAME)}>start</Button>
      </ActionBarContainer>
    );
  }

  if (step === STEP_NICKNAME) {
    return (
      <ActionBarContainer>
        <Button onClick={() => setupNickname()}>chose nickname</Button>
      </ActionBarContainer>
    );
  }

  if (step === STEP_RULES) {
    return (
      <ActionBarContainer>
        <Button onClick={() => setStep(STEP_AVATAR_UPLOAD)}>
          I endorce rules
        </Button>
      </ActionBarContainer>
    );
  }

  if (step === STEP_AVATAR_UPLOAD) {
    return (
      <ActionBarContainer>
        <Pane width="65%" alignItems="flex-end" display="flex">
          <ActionBarContentText>
            <div>
              {avatarImg !== null && avatarImg.name
                ? avatarImg.name
                : 'Select img file'}
            </div>
            <input
              ref={inputOpenFileRef}
              onChange={() => onFilePickerChange(inputOpenFileRef)}
              type="file"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className={
                avatarImg !== null && avatarImg !== undefined
                  ? 'btn-add-close'
                  : 'btn-add-file'
              }
              onClick={
                avatarImg !== null && avatarImg !== undefined
                  ? onClickClear
                  : showOpenFileDlg
              }
            />
          </ActionBarContentText>
          <Button
            disabled={avatarIpfs === null}
            onClick={() => uploadAvatarImg()}
          >
            {avatarIpfs == null ? <Dots /> : 'Upload'}
          </Button>
        </Pane>
      </ActionBarContainer>
    );
  }

  if (step === STEP_KEPLR_REGISTER) {
    return (
      <ActionBarContainer>
        <Button onClick={() => onClickRegister()}>register</Button>
      </ActionBarContainer>
    );
  }

  return null;
}

export default ActionBar;
