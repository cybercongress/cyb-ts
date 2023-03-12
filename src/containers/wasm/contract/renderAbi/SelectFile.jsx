/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';

const SelectFile = ({ useStateCallback, text = 'Upload query schema' }) => {
  const inputOpenFileRef = useRef(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const updateState = async () => {
      if (useStateCallback) {
        if (file !== null && file.type === 'application/json') {
          const bufferJson = new Uint8Array(await file.arrayBuffer());
          const stringJson = uint8ArrayToAsciiString(bufferJson);
          const jsonObj = JSON.parse(stringJson);
          useStateCallback(jsonObj);
        }
      }
    };
    updateState();
  }, [file]);

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  const onFilePickerChange = (files, e) => {
    const currentFile = files.current.files[0];
    setFile(currentFile);
    e.target.value = '';
  };

  const onClickClear = () => {
    setFile(null);
    useStateCallback(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        fontSize: '18px',
      }}
    >
      <div>{file !== null && file.name ? file.name : text}</div>
      <input
        ref={inputOpenFileRef}
        onChange={(e) => onFilePickerChange(inputOpenFileRef, e)}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className={file !== null ? 'btn-add-close' : 'btn-add-file'}
        onClick={file !== null ? onClickClear : showOpenFileDlg}
      />
    </div>
  );
};

export default SelectFile;
