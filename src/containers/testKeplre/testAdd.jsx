/* eslint-disable */
import { useState, useRef } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import AddFileButton from 'src/components/buttons/AddFile/AddFile';

const getName = (file) => file.name;

function AddTest() {
  const inputOpenFileRef = useRef();
  const [totalSupply, setTotalSupply] = useState(null);
  const [file, setFile] = useState(null);

  // useEffect(() => {
  //   const feachData = async () => {
  //     // if (nodeIpfs !== null) {
  //     //   // new Blob()
  //     // }
  //     const data = new Buffer('123fds');
  //     console.log(`data`, data)
  //     const dataFileType = await FileType.fromBuffer(data);
  //     console.log(`dataFileType`, dataFileType)
  //   };
  //   feachData();
  // }, [nodeIpfs]);

  const addPin = async () => {
    // console.log(`file`, file)
    // let dataFile;
    // if (typeof file === 'string') {
    //   dataFile = new File([file], 'file.txt');
    // } else if (file.name) {
    //   dataFile = new File([file], file.name);
    // }
    // const formData = new FormData();
    // formData.append('file', dataFile);
    try {
      const response = await axios({
        method: 'get',
        url: 'https://gateway.ipfs.cybernode.ai/ipfs/QmVdVFZDsSTVCeVLgWLU1fWxmZnYLCM5yD5RS4NpZQmDBp',
      });
      console.log(`response`, response);
    } catch (error) {
      console.log(`error`, error);
    }
  };

  console.log(`totalSupply`, totalSupply);

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  const onFilePickerChange = (files) => {
    const fileOnChange = files.current.files[0];

    setFile(fileOnChange);
  };

  const onClickClear = () => {
    setFile(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {file !== null && file !== undefined ? file.name : ''}
      <input
        ref={inputOpenFileRef}
        onChange={() => onFilePickerChange(inputOpenFileRef)}
        type="file"
        style={{ display: 'none' }}
      />
      <AddFileButton
        isRemove={file}
        onClick={file ? onClickClear : showOpenFileDlg}
      />
      <button type="button" onClick={() => addPin()}>
        add
      </button>
    </div>
  );
}

export default AddTest;
